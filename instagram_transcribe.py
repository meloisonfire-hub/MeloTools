import json
import subprocess
import sys
import wave
from pathlib import Path

LANG_MAP = {
    "pt": "pt",
    "en": "en",
    "es": "es",
    "ko": "ko",
}


def write_output(text: str, out_txt: Path):
    cleaned = "\n".join(line.strip() for line in text.splitlines() if line.strip()).strip()
    if not cleaned:
        raise RuntimeError("instagram_transcript_empty")
    out_txt.write_text(cleaned + "\n", encoding="utf-8")


def transcribe_with_faster_whisper(media_path: Path, out_txt: Path, lang: str):
    from faster_whisper import WhisperModel

    model = WhisperModel("tiny", device="cpu", compute_type="int8")
    segments, _info = model.transcribe(
        str(media_path),
        language=LANG_MAP.get(lang),
        vad_filter=True,
    )
    text = " ".join((segment.text or "").strip() for segment in segments if (segment.text or "").strip())
    write_output(text, out_txt)


def transcribe_with_whisper(media_path: Path, out_txt: Path, lang: str):
    import whisper

    result = whisper.load_model("tiny").transcribe(
        str(media_path),
        fp16=False,
        language=LANG_MAP.get(lang),
    )
    write_output(result.get("text") or "", out_txt)


def extract_wav(media_path: Path, wav_path: Path):
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(media_path),
            "-vn",
            "-ac",
            "1",
            "-ar",
            "16000",
            "-f",
            "wav",
            str(wav_path),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def transcribe_with_vosk(media_path: Path, out_txt: Path, lang: str):
    from vosk import KaldiRecognizer, Model, SetLogLevel

    model_map = {
        "pt": Path("/srv/ocr-web/models/vosk-model-small-pt-0.3"),
    }
    model_path = model_map.get(lang) or model_map["pt"]
    if not model_path.exists():
        raise RuntimeError(f"vosk_model_missing:{model_path}")

    wav_path = out_txt.with_suffix(".wav")
    try:
        extract_wav(media_path, wav_path)
        SetLogLevel(-1)
        model = Model(str(model_path))
        results = []
        with wave.open(str(wav_path), "rb") as wf:
            recognizer = KaldiRecognizer(model, wf.getframerate())
            recognizer.SetWords(False)
            while True:
                data = wf.readframes(4000)
                if not data:
                    break
                if recognizer.AcceptWaveform(data):
                    payload = json.loads(recognizer.Result())
                    text = (payload.get("text") or "").strip()
                    if text:
                        results.append(text)
            payload = json.loads(recognizer.FinalResult())
            text = (payload.get("text") or "").strip()
            if text:
                results.append(text)
        write_output("\n".join(results), out_txt)
    finally:
        wav_path.unlink(missing_ok=True)


def main():
    media_path = Path(sys.argv[1])
    out_txt = Path(sys.argv[2])
    lang = (sys.argv[3] if len(sys.argv) > 3 else "pt").strip().lower() or "pt"
    errors = []

    for label, fn in (
        ("faster_whisper", transcribe_with_faster_whisper),
        ("whisper", transcribe_with_whisper),
        ("vosk", transcribe_with_vosk),
    ):
        try:
            fn(media_path, out_txt, lang)
            return 0
        except Exception as exc:
            errors.append(f"{label}:{exc}")

    raise RuntimeError(" | ".join(errors) or "instagram_transcript_failed")


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        message = str(exc) or "instagram_transcript_failed"
        print(message, file=sys.stderr)
        raise SystemExit(1)
