window.I18N_APP = (() => {
  const catalog = {
  "pt": {
    "language_label": "Idioma",
    "hero_upload_title": "Fácil",
    "hero_upload_sub": "Selecione a tarefa desejada",
    "hero_free_title": "Licença Freeware",
    "hero_free_sub": "100% gratuito (Sem premium)",
    "hero_safe_title": "Sessão Temporária",
    "hero_safe_sub": "Arquivos excluídos após a tarefa",
    "nav_pdf": "PDF",
    "nav_image": "Imagem",
    "nav_media": "Redes sociais",
    "nav_video": "V\u00eddeos",
    "tab_ocr": "OCR PDF",
    "tab_merge": "Organizar PDF",
    "tab_rotate": "Girar PDF",
    "tab_split": "Particionar PDF",
    "tab_compress": "Comprimir PDF",
    "tab_protect": "Proteger PDF",
    "tab_removebg": "Remover fundo",
    "tab_youtube": "Baixar v\u00eddeos",
    "tab_video": "Dividir v\u00eddeos",
    "ocr_title": "Converta PDFs e imagens em documentos pesquis\u00e1veis (OCR)",
    "ocr_sub": "Tamanho m\u00e1ximo de {max_mb} MB por arquivo",
    "upload_cta": "Selecione arquivos, arraste para esta área ou cole aqui",
    "download_all": "Baixar todos",
    "ocr_note": "Formatos suportados: PDF, PNG, JPG, JPEG, TIFF",
    "merge_title": "Organize PDFs e imagens em um \u00fanico PDF",
    "merge_sub": "Adicione, una, remova e arraste para reordenar antes de gerar o arquivo final",
    "generate_pdf": "Aplicar",
    "rotate_title": "Girar PDFs/Imagens",
    "rotate_sub": "Rotacione aqui seus arquivos",
    "rotate_now": "Aplicar",
    "split_title": "Particionar PDF/Imagens",
    "split_sub": "Envie seus PDFs ou imagens e escolha o modo de particionamento",
    "split_mode_size": "por tamanho (MB)",
    "split_mode_every": "intervalo fixo",
    "split_mode_ranges": "intervalo personalizado",
    "split_action": "Particionar",
    "compress_title": "Comprimir PDFs",
    "compress_sub": "Escolha o n\u00edvel e envie um ou mais arquivos",
    "compress_level": "N\u00edvel de compress\u00e3o:",
    "compress_max": "M\u00e1xima",
    "compress_high": "Alta",
    "compress_medium": "M\u00e9dia",
    "compress_low": "Baixa",
    "compress_now": "Aplicar",
    "compress_tip": "Dica: quanto maior o n\u00edvel de compress\u00e3o, mais qualidade o arquivo perde.",
    "protect_title": "Proteger PDFs com senha",
    "protect_sub": "Envie um ou mais PDFs e defina uma senha para todos os arquivos selecionados",
    "password": "Senha:",
    "password_confirm": "Confirmar:",
    "password_placeholder": "m\u00ednimo de 4 caracteres",
    "password_repeat_placeholder": "repita a senha",
    "protect_now": "Aplicar",
    "protect_note": "A mesma senha ser\u00e1 aplicada a todos os PDFs enviados nesta opera\u00e7\u00e3o.",
    "removebg_title": "Remover fundo de imagens",
    "removebg_sub": "Envie uma ou mais imagens para gerar PNGs com fundo transparente",
    "removebg_strength": "Intensidade do recorte",
    "removebg_note": "Ajuste a barra e veja ao vivo uma pr\u00e9via aproximada do PNG final.",
    "removebg_preview": "Pr\u00e9-visualiza\u00e7\u00e3o",
    "removebg_preview_hint": "A primeira imagem enviada aparece aqui.",
    "removebg_action": "Remover fundo",
    "removebg_formats": "Formatos suportados: PNG, JPG, JPEG e TIFF. O resultado sai em PNG transparente.",
    "youtube_title": "Baixar v\u00eddeos",
    "youtube_sub": "Informe links e execute o processamento.",
    "youtube_link": "Link:",
    "youtube_placeholder": "Cole aqui os links",
    "youtube_mode_video": "V\u00eddeo",
    "youtube_mode_audio": "\u00c1udio",
    "youtube_action": "Executar",
    "youtube_quality": "Qualidade do v\u00eddeo:",
    "youtube_bitrate": "Bitrate do \u00e1udio:",
    "youtube_progress": "Preparando download...",
    "youtube_note": "As qualidades exibidas dependem do que cada plataforma oferece para o v\u00eddeo.",
    "youtube_batch_hint": "Cole os links, um por linha ou separados por espaço.",
    "youtube_batch_title": "Download em lote",
    "youtube_batch_summary": "{valid} links v\u00e1lidos de {total} enviados.",
    "youtube_batch_invalid_summary": "{invalid} links inv\u00e1lidos ser\u00e3o ignorados.",
    "youtube_batch_ready_info": "Lote pronto para processamento.",
    "youtube_batch_queue": "Preparando lote...",
    "youtube_batch_running": "Processando lote...",
    "youtube_batch_ready": "Lote conclu\u00eddo.",
    "youtube_batch_partial": "Lote conclu\u00eddo com alguns erros.",
    "youtube_batch_failed": "N\u00e3o foi poss\u00edvel concluir o lote.",
    "youtube_batch_no_valid_links": "Nenhum link v\u00e1lido foi encontrado para o lote.",
    "youtube_batch_too_many": "Envie no m\u00e1ximo {limit} links por vez.",
    "youtube_batch_min_links": "Cole pelo menos 2 links para usar o lote.",
    "youtube_batch_zip": "Baixar ZIP do lote",
    "youtube_queue": "Entrando na fila...",
    "youtube_prepare": "Preparando download...",
    "youtube_downloading": "Baixando v\u00eddeo...",
    "youtube_audio_convert": "Convertendo \u00e1udio...",
    "youtube_video_finalize": "Finalizando v\u00eddeo...",
    "youtube_ready": "Pronto.",
    "youtube_failed": "Falha ao baixar o v\u00eddeo.",
    "youtube_content_failed": "Falha ao processar o conte\u00fado desse link.",
    "video_title": "Dividir v\u00eddeos por tamanho",
    "video_sub": "Envie um v\u00eddeo e escolha o tamanho (MB) de cada parte.",
    "video_upload": "Voc\u00ea pode arrastar e soltar seu v\u00eddeo aqui, colar ou clicar para fazer o upload",
    "video_size": "Tamanho por parte (MB):",
    "video_action": "Dividir v\u00eddeo",
    "video_progress": "Processando...",
    "video_download_all": "Baixar todas as partes",
    "example_size": "ex.: 6",
    "example_every": "ex.: 5",
    "example_ranges": "ex.: 1-3,7,10-12",
    "example_video_size": "ex.: 100",
    "footer_html": "Gostando das ferramentas? Me pague um café - <span class=\"footer-pix-wrap\"><span class=\"footer-pix\">pix@melotools.com.br</span> <button type=\"button\" class=\"footer-pix-copy\" data-copy-pix=\"pix@melotools.com.br\">Copiar</button></span><br><a href=\"https://instagram.com/meloisonfire\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"footer-link\">Fale com o desenvolvedor</a>",
    "download": "Baixar",
    "ready": "Pronto.",
    "uploading": "Enviando...",
    "processing_ocr": "Processando OCR...",
    "unsupported_pdf_image": "Tipo n\u00e3o suportado. Use PDF/JPG/PNG/TIFF",
    "unsupported_video_type_client": "Tipo n\u00e3o suportado. Use MP4/MOV/MKV/AVI/WEBM",
    "file_limit": "Arquivo acima do limite de {max_mb} MB.",
    "invalid_server_response": "Resposta inv\u00e1lida do servidor.",
    "unexpected_html": "O servidor respondeu com HTML inesperado ({status}). Trecho: {snippet}",
    "invalid_response_snippet": "Resposta inv\u00e1lida do servidor ({status}). Trecho: {snippet}",
    "generic_failure": "Falha.",
    "select_files_first": "Selecione arquivos primeiro.",
    "merge_success": "PDF gerado: <a class=\"btn\" href=\"{link}\">{download}</a>",
    "organize_failed": "Falha ao organizar PDF.",
    "sending_and_rotating": "Enviando e girando...",
    "rotate_download_named": "Baixar {name}",
    "select_pdf_or_images": "Selecione um PDF ou imagens.",
    "choose_mode": "Escolha um modo.",
    "sending_and_splitting": "Enviando e particionando...",
    "pdf_label": "PDF",
    "remove": "remover",
    "pdf_only": "Envie apenas PDF.",
    "before": "Antes",
    "after": "Depois",
    "reduction": "Redu\u00e7\u00e3o",
    "savings": "Economia",
    "no_savings": "Sem economia",
    "select_pdfs_first": "Selecione PDFs primeiro.",
    "sending_and_compressing": "Enviando e comprimindo...",
    "sending_and_protecting": "Enviando e protegendo...",
    "password_short": "Use uma senha com pelo menos 4 caracteres.",
    "password_mismatch": "As senhas n\u00e3o coincidem.",
    "preview_load_failed": "Falha ao carregar a imagem para a pr\u00e9via.",
    "preview_unavailable": "N\u00e3o foi poss\u00edvel gerar a pr\u00e9via desta imagem.",
    "preview_first_hint": "A primeira imagem enviada aparece aqui.",
    "preview_of": "Pr\u00e9via aproximada de {name}",
    "images_only": "Envie apenas imagens JPG, PNG ou TIFF.",
    "select_images_first": "Selecione imagens primeiro.",
    "processing_images": "Processando imagens...",
    "remove_bg_failed": "Falha ao remover o fundo.",
    "duration": "Dura\u00e7\u00e3o: {value}",
    "processing_generic": "Processando...",
    "progress_check_failed": "N\u00e3o foi poss\u00edvel consultar o progresso.",
    "analyze_link": "Analisando link...",
    "link_ready": "Link pronto para download.",
    "analyze_failed": "Falha ao analisar o link.",
    "paste_video_link": "Cole um link de v\u00eddeo primeiro.",
    "wait_link_analysis": "Aguarde a an\u00e1lise autom\u00e1tica do link antes de baixar.",
    "select_media_mode": "Selecione V\u00eddeo ou \u00c1udio antes de baixar.",
    "downloading_video": "Baixando v\u00eddeo...",
    "downloading_audio": "Baixando \u00e1udio...",
    "preparing_video": "Preparando v\u00eddeo...",
    "preparing_audio": "Preparando \u00e1udio...",
    "download_started": "Download iniciado...",
    "error_prefix": "Erro: {error}",
    "selected_file": "Selecionado: {name}",
    "select_video": "Selecione um v\u00eddeo.",
    "valid_video_size": "Informe um tamanho (MB) v\u00e1lido.",
    "splitting_video": "Dividindo v\u00eddeo...",
    "sending": "Enviando...",
    "queue_default": "Entrando na fila...",
    "instagram_tab": "Instagram",
    "instagram_title": "Instagram",
    "instagram_sub": "Cole um link do Instagram e escolha o que deseja baixar.",
    "instagram_link": "Link:",
    "instagram_placeholder": "Cole aqui o link do Instagram",
    "instagram_action_video": "Baixar o v\u00eddeo",
    "instagram_action_videos": "Baixar todos os v\u00eddeos do carrossel",
    "instagram_action_transcript": "Baixar a transcri\u00e7\u00e3o do v\u00eddeo",
    "instagram_action_images": "Baixar as imagens do carrossel",
    "instagram_action_ocr": "Baixar o OCR das imagens",
    "instagram_note": "Suporta reels, posts e carross\u00e9is p\u00fablicos do Instagram.",
    "instagram_progress": "Preparando...",
    "instagram_meta_counts": "V\u00eddeos: {videos} \u2022 Imagens: {images}",
    "instagram_analyzing": "Analisando o link do Instagram...",
    "instagram_ready_info": "Link do Instagram pronto.",
    "instagram_status_video": "Baixando v\u00eddeo...",
    "instagram_status_videos": "Baixando todos os v\u00eddeos...",
    "instagram_status_transcript": "Gerando transcri\u00e7\u00e3o...",
    "instagram_status_images": "Baixando imagens...",
    "instagram_status_ocr": "Executando OCR nas imagens...",
    "instagram_url_required": "Cole um link do Instagram primeiro.",
    "instagram_wait_analysis": "Aguarde a an\u00e1lise do link do Instagram.",
    "instagram_queue": "Entrando na fila...",
    "instagram_prepare": "Preparando Instagram...",
    "instagram_transcribing": "Transcrevendo \u00e1udio...",
    "instagram_ready": "Pronto.",
    "instagram_failed": "Falha ao processar o link do Instagram.",
    "instagram_invalid_url": "Envie um link v\u00e1lido do Instagram.",
    "instagram_info_failed": "N\u00e3o foi poss\u00edvel analisar esse link do Instagram.",
    "instagram_invalid_action": "A\u00e7\u00e3o do Instagram inv\u00e1lida.",
    "instagram_video_unavailable": "Nenhum v\u00eddeo foi encontrado nesse link do Instagram.",
    "instagram_images_unavailable": "Nenhuma imagem foi encontrada nesse link do Instagram.",
    "instagram_video_failed": "Falha ao baixar o v\u00eddeo do Instagram.",
    "instagram_transcript_empty": "N\u00e3o foi poss\u00edvel gerar a transcri\u00e7\u00e3o desse v\u00eddeo.",
    "instagram_transcript_failed": "Falha ao gerar a transcri\u00e7\u00e3o do v\u00eddeo.",
    "instagram_ocr_missing": "Tesseract n\u00e3o encontrado no servidor.",
    "cookie_banner_title": "Aviso de cookies",
    "cookie_notice": "Usamos cookies para melhorar sua experi\u00eancia e analisar o uso do site.",
    "cookie_policy_link": "Ler pol\u00edtica de cookies",
    "cookie_accept_all": "Aplicar",
    "cookie_reject_optional": "Rejeitar opcionais",
    "cookie_manage": "Gerenciar",
    "cookie_preferences_title": "Prefer\u00eancias de cookies",
    "cookie_preferences_text": "Voc\u00ea pode escolher quais cookies opcionais deseja permitir.",
    "cookie_necessary_title": "Cookies necess\u00e1rios",
    "cookie_necessary_text": "Essenciais para o funcionamento do site e sempre ativos.",
    "cookie_analytics_title": "Cookies anal\u00edticos",
    "cookie_analytics_text": "Ajudam a entender o uso do site para melhorar a experi\u00eancia.",
    "cookie_always_on": "Sempre ativos",
    "cookie_save_preferences": "Salvar prefer\u00eancias",
    "cookie_accept": "Aceitar"
  },
  "en": {
    "language_label": "Language",
    "hero_upload_title": "Fast upload",
    "hero_upload_sub": "Drag, drop, paste, or click",
    "hero_free_title": "100% free",
    "hero_free_sub": "No premium plans",
    "hero_safe_title": "Secure",
    "hero_safe_sub": "Your files are not kept",
    "nav_pdf": "PDF",
    "nav_image": "Image",
    "nav_media": "Social media",
    "nav_video": "Videos",
    "tab_ocr": "OCR PDF",
    "tab_merge": "Organize PDF",
    "tab_rotate": "Rotate PDF",
    "tab_split": "Split PDF",
    "tab_compress": "Compress PDF",
    "tab_protect": "Protect PDF",
    "tab_removebg": "Remove background",
    "tab_youtube": "Download videos",
    "tab_video": "Split videos",
    "ocr_title": "Turn PDFs and images into searchable documents (OCR)",
    "ocr_sub": "Maximum size: {max_mb} MB per file",
    "upload_cta": "You can drag and drop your files here, paste them, or click to upload",
    "download_all": "Download all",
    "ocr_note": "Supported formats: PDF, PNG, JPG, JPEG, TIFF",
    "merge_title": "Combine PDFs and images into a single PDF",
    "merge_sub": "Add, merge, remove, and drag to reorder before generating the final file",
    "generate_pdf": "Generate PDF",
    "rotate_title": "Rotate PDFs/Images",
    "rotate_sub": "Rotate your files here",
    "rotate_now": "Rotate now",
    "split_title": "Split PDF/Images",
    "split_sub": "Upload your PDFs or images and choose the split mode",
    "split_mode_size": "by size (MB)",
    "split_mode_every": "fixed interval",
    "split_mode_ranges": "custom range",
    "split_action": "Split",
    "compress_title": "Compress PDFs",
    "compress_sub": "Choose the level and upload one or more files",
    "compress_level": "Compression level:",
    "compress_max": "Maximum",
    "compress_high": "High",
    "compress_medium": "Medium",
    "compress_low": "Low",
    "compress_now": "Compress now",
    "compress_tip": "Tip: the higher the compression level, the more quality the file may lose.",
    "protect_title": "Protect PDFs with a password",
    "protect_sub": "Upload one or more PDFs and set one password for all selected files",
    "password": "Password:",
    "password_confirm": "Confirm:",
    "password_placeholder": "minimum 4 characters",
    "password_repeat_placeholder": "repeat the password",
    "protect_now": "Protect now",
    "protect_note": "The same password will be applied to all PDFs uploaded in this operation.",
    "removebg_title": "Remove image backgrounds",
    "removebg_sub": "Upload one or more images to generate PNGs with transparent backgrounds",
    "removebg_strength": "Cutout strength",
    "removebg_note": "Adjust the slider and see a live approximation of the final PNG.",
    "removebg_preview": "Preview",
    "removebg_preview_hint": "The first uploaded image appears here.",
    "removebg_action": "Remove background",
    "removebg_formats": "Supported formats: PNG, JPG, JPEG, and TIFF. The output is a transparent PNG.",
    "youtube_title": "Download videos",
    "youtube_sub": "Paste one or more YouTube or Instagram links, choose video or audio, and select an available quality.",
    "youtube_link": "Link:",
    "youtube_placeholder": "Paste one or more YouTube or Instagram links here",
    "youtube_mode_video": "Video",
    "youtube_mode_audio": "Audio",
    "youtube_action": "Generate file(s)",
    "youtube_quality": "Video quality:",
    "youtube_bitrate": "Audio bitrate:",
    "youtube_progress": "Preparing download...",
    "youtube_note": "The available qualities depend on each video's source.",
    "youtube_batch_hint": "Paste up to 100 links, one per line or separated by spaces. YouTube and Instagram links are supported.",
    "youtube_batch_title": "Batch download",
    "youtube_batch_summary": "{valid} valid links out of {total} submitted.",
    "youtube_batch_invalid_summary": "{invalid} invalid links will be ignored.",
    "youtube_batch_ready_info": "Batch ready to start.",
    "youtube_batch_queue": "Preparing batch...",
    "youtube_batch_running": "Processing batch...",
    "youtube_batch_ready": "Batch completed.",
    "youtube_batch_partial": "Batch completed with some errors.",
    "youtube_batch_failed": "The batch could not be completed.",
    "youtube_batch_no_valid_links": "No valid links were found for the batch.",
    "youtube_batch_too_many": "Send at most {limit} links at a time.",
    "youtube_batch_min_links": "Paste at least 2 links to use batch mode.",
    "youtube_batch_zip": "Download batch ZIP",
    "youtube_queue": "Queued...",
    "youtube_prepare": "Preparing download...",
    "youtube_downloading": "Downloading video...",
    "youtube_audio_convert": "Converting audio...",
    "youtube_video_finalize": "Finalizing video...",
    "youtube_ready": "Ready.",
    "youtube_failed": "Failed to download the video.",
    "youtube_content_failed": "Failed to process this link.",
    "video_title": "Split videos by size",
    "video_sub": "Upload a video and choose the size (MB) of each part.",
    "video_upload": "You can drag and drop your video here, paste it, or click to upload",
    "video_size": "Size per part (MB):",
    "video_action": "Split video",
    "video_progress": "Processing...",
    "video_download_all": "Download all parts",
    "example_size": "e.g.: 6",
    "example_every": "e.g.: 5",
    "example_ranges": "e.g.: 1-3,7,10-12",
    "example_video_size": "e.g.: 100",
    "footer_html": "Gostando das ferramentas? Me pague um café - <span class=\"footer-pix-wrap\"><span class=\"footer-pix\">pix@melotools.com.br</span> <button type=\"button\" class=\"footer-pix-copy\" data-copy-pix=\"pix@melotools.com.br\">Copiar</button></span><br><a href=\"https://instagram.com/meloisonfire\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"footer-link\">Fale com o desenvolvedor</a>",
    "download": "Download",
    "ready": "Ready.",
    "uploading": "Uploading...",
    "processing_ocr": "Running OCR...",
    "unsupported_pdf_image": "Unsupported type. Use PDF/JPG/PNG/TIFF",
    "unsupported_video_type_client": "Unsupported type. Use MP4/MOV/MKV/AVI/WEBM",
    "file_limit": "File exceeds the {max_mb} MB limit.",
    "invalid_server_response": "Invalid server response.",
    "unexpected_html": "The server returned unexpected HTML ({status}). Snippet: {snippet}",
    "invalid_response_snippet": "Invalid server response ({status}). Snippet: {snippet}",
    "generic_failure": "Failed.",
    "select_files_first": "Select files first.",
    "merge_success": "Generated PDF: <a class=\"btn\" href=\"{link}\">{download}</a>",
    "organize_failed": "Failed to organize PDF.",
    "sending_and_rotating": "Uploading and rotating...",
    "rotate_download_named": "Download {name}",
    "select_pdf_or_images": "Select a PDF or images.",
    "choose_mode": "Choose a mode.",
    "sending_and_splitting": "Uploading and splitting...",
    "pdf_label": "PDF",
    "remove": "remove",
    "pdf_only": "Send PDF files only.",
    "before": "Before",
    "after": "After",
    "reduction": "Reduction",
    "savings": "Savings",
    "no_savings": "No savings",
    "select_pdfs_first": "Select PDFs first.",
    "sending_and_compressing": "Uploading and compressing...",
    "sending_and_protecting": "Uploading and protecting...",
    "password_short": "Use a password with at least 4 characters.",
    "password_mismatch": "Passwords do not match.",
    "preview_load_failed": "Failed to load the image preview.",
    "preview_unavailable": "Could not generate a preview for this image.",
    "preview_first_hint": "The first uploaded image appears here.",
    "preview_of": "Approximate preview of {name}",
    "images_only": "Upload JPG, PNG, or TIFF images only.",
    "select_images_first": "Select images first.",
    "processing_images": "Processing images...",
    "remove_bg_failed": "Failed to remove the background.",
    "duration": "Duration: {value}",
    "processing_generic": "Processing...",
    "progress_check_failed": "Could not check progress.",
    "analyze_link": "Analyzing link...",
    "link_ready": "Link ready for download.",
    "analyze_failed": "Failed to analyze the link.",
    "paste_video_link": "Paste a video link first.",
    "wait_link_analysis": "Wait for the automatic link analysis before downloading.",
    "select_media_mode": "Select Video or Audio before downloading.",
    "downloading_video": "Downloading video...",
    "downloading_audio": "Downloading audio...",
    "preparing_video": "Preparing video...",
    "preparing_audio": "Preparing audio...",
    "download_started": "Download started...",
    "error_prefix": "Error: {error}",
    "selected_file": "Selected: {name}",
    "select_video": "Select a video.",
    "valid_video_size": "Enter a valid size (MB).",
    "splitting_video": "Splitting video...",
    "sending": "Uploading...",
    "queue_default": "Queued...",
    "instagram_tab": "Instagram",
    "instagram_title": "Instagram",
    "instagram_sub": "Paste an Instagram link and choose what you want to download.",
    "instagram_link": "Link:",
    "instagram_placeholder": "Paste the Instagram link here",
    "instagram_action_video": "Download video",
    "instagram_action_videos": "Download all carousel videos",
    "instagram_action_transcript": "Download video transcript",
    "instagram_action_images": "Download carousel images",
    "instagram_action_ocr": "Download image OCR text",
    "instagram_note": "Supports public Instagram reels, posts, and carousels.",
    "instagram_progress": "Preparing...",
    "instagram_meta_counts": "Videos: {videos} \u2022 Images: {images}",
    "instagram_analyzing": "Analyzing Instagram link...",
    "instagram_ready_info": "Instagram link ready.",
    "instagram_status_video": "Downloading video...",
    "instagram_status_videos": "Downloading all videos...",
    "instagram_status_transcript": "Generating transcript...",
    "instagram_status_images": "Downloading images...",
    "instagram_status_ocr": "Running OCR on images...",
    "instagram_url_required": "Paste an Instagram link first.",
    "instagram_wait_analysis": "Wait for the Instagram link analysis first.",
    "instagram_queue": "Queued...",
    "instagram_prepare": "Preparing Instagram...",
    "instagram_transcribing": "Transcribing audio...",
    "instagram_ready": "Ready.",
    "instagram_failed": "Failed to process the Instagram link.",
    "instagram_invalid_url": "Send a valid Instagram link.",
    "instagram_info_failed": "Could not analyze this Instagram link.",
    "instagram_invalid_action": "Invalid Instagram action.",
    "instagram_video_unavailable": "No video was found in this Instagram link.",
    "instagram_images_unavailable": "No image was found in this Instagram link.",
    "instagram_video_failed": "Failed to download the Instagram video.",
    "instagram_transcript_empty": "Could not generate a transcript for this video.",
    "instagram_transcript_failed": "Failed to generate the video transcript.",
    "instagram_ocr_missing": "Tesseract was not found on the server.",
    "cookie_banner_title": "Cookie notice",
    "cookie_notice": "We use cookies to improve your experience and analyze site usage.",
    "cookie_policy_link": "Read cookie policy",
    "cookie_accept_all": "Accept",
    "cookie_reject_optional": "Reject optional",
    "cookie_manage": "Manage",
    "cookie_preferences_title": "Cookie preferences",
    "cookie_preferences_text": "You can choose which optional cookies to allow.",
    "cookie_necessary_title": "Necessary cookies",
    "cookie_necessary_text": "Essential for the website to work and always enabled.",
    "cookie_analytics_title": "Analytics cookies",
    "cookie_analytics_text": "Help us understand site usage to improve the experience.",
    "cookie_always_on": "Always active",
    "cookie_save_preferences": "Save preferences",
    "cookie_accept": "Accept"
  },
  "es": {
    "language_label": "Idioma",
    "hero_upload_title": "Carga rapida",
    "hero_upload_sub": "Arrastra, suelta, pega o haz clic",
    "hero_free_title": "100% gr\u00e1tis",
    "hero_free_sub": "Nada de planes premium",
    "hero_safe_title": "Seguro",
    "hero_safe_sub": "Tus archivos no se retienen",
    "nav_pdf": "PDF",
    "nav_image": "Imagen",
    "nav_media": "Redes sociales",
    "nav_video": "Videos",
    "tab_ocr": "OCR PDF",
    "tab_merge": "Organizar PDF",
    "tab_rotate": "Girar PDF",
    "tab_split": "Dividir PDF",
    "tab_compress": "Comprimir PDF",
    "tab_protect": "Proteger PDF",
    "tab_removebg": "Quitar fondo",
    "tab_youtube": "Descargar videos",
    "tab_video": "Dividir v\u00eddeos",
    "ocr_title": "Convierte PDFs e imagenes en documentos con busqueda (OCR)",
    "ocr_sub": "Tamaño máximo de {max_mb} MB por archivo",
    "upload_cta": "Puedes arrastrar y soltar tus archivos aqui, pegarlos o hacer clic para subirlos",
    "download_all": "Descargar todo",
    "ocr_note": "Formatos compatibles: PDF, PNG, JPG, JPEG, TIFF",
    "merge_title": "Organiza PDFs e imágenes en un único PDF",
    "merge_sub": "Agrega, une, elimina y arrastra para reordenar antes de generar el archivo final",
    "generate_pdf": "Generar PDF",
    "rotate_title": "Girar PDFs/Imagenes",
    "rotate_sub": "Gira aqui tus archivos",
    "rotate_now": "Girar ahora",
    "split_title": "Dividir PDF/Imagenes",
    "split_sub": "Sube tus PDFs o imagenes y elige el modo de division",
    "split_mode_size": "por tamano (MB)",
    "split_mode_every": "intervalo fijo",
    "split_mode_ranges": "intervalo personalizado",
    "split_action": "Dividir",
    "compress_title": "Comprimir PDFs",
    "compress_sub": "Elige el nivel y sube uno o más archivos",
    "compress_level": "Nivel de compresión:",
    "compress_max": "M\u00e1xima",
    "compress_high": "Alta",
    "compress_medium": "M\u00e9dia",
    "compress_low": "Baja",
    "compress_now": "Comprimir ahora",
    "compress_tip": "Consejo: cuanto mayor sea el nivel de compresión, más calidad puede perder el archivo.",
    "protect_title": "Proteger PDFs con contraseña",
    "protect_sub": "Sube uno o mas PDFs y define una contraseña para todos los archivos seleccionados",
    "password": "Contrasena:",
    "password_confirm": "Confirmar:",
    "password_placeholder": "mínimo 4 caracteres",
    "password_repeat_placeholder": "repite la contraseña",
    "protect_now": "Proteger ahora",
    "protect_note": "La misma contraseña se aplicará a todos los PDFs enviados en esta operación.",
    "removebg_title": "Quitar fondo de imagenes",
    "removebg_sub": "Sube una o mas imagenes para generar PNG con fondo transparente",
    "removebg_strength": "Intensidad del recorte",
    "removebg_note": "Ajusta la barra y ve una vista previa aproximada del PNG final.",
    "removebg_preview": "Vista previa",
    "removebg_preview_hint": "La primera imagen enviada aparece aqui.",
    "removebg_action": "Quitar fondo",
    "removebg_formats": "Formatos compatibles: PNG, JPG, JPEG y TIFF. El resultado sale en PNG transparente.",
    "youtube_title": "Descargar videos",
    "youtube_sub": "Pega un enlace de YouTube, TikTok o Instagram, elige si quieres video o audio y selecciona la calidad disponible",
    "youtube_link": "Enlace:",
    "youtube_placeholder": "Pega aqui el enlace de YouTube, TikTok o Instagram",
    "youtube_mode_video": "V\u00eddeo",
    "youtube_mode_audio": "\u00c1udio",
    "youtube_action": "Generar archivo",
    "youtube_quality": "Calidad del video:",
    "youtube_bitrate": "Bitrate del audio:",
    "youtube_progress": "Preparando descarga...",
    "youtube_note": "Las calidades mostradas dependen de lo que el video ofrece en YouTube.",
    "video_title": "Dividir videos por tama\u00f1o",
    "video_sub": "Sube un video y elige el tamano (MB) de cada parte.",
    "video_upload": "Puedes arrastrar y soltar tu video aqui, pegarlo o hacer clic para subirlo",
    "video_size": "Tamano por parte (MB):",
    "video_action": "Dividir video",
    "video_progress": "Procesando...",
    "video_download_all": "Descargar todas las partes",
    "example_size": "ej.: 6",
    "example_every": "ej.: 5",
    "example_ranges": "ej.: 1-3,7,10-12",
    "example_video_size": "ej.: 100",
    "footer_html": "Gostando das ferramentas? Me pague um café - <span class=\"footer-pix-wrap\"><span class=\"footer-pix\">pix@melotools.com.br</span> <button type=\"button\" class=\"footer-pix-copy\" data-copy-pix=\"pix@melotools.com.br\">Copiar</button></span><br><a href=\"https://instagram.com/meloisonfire\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"footer-link\">Fale com o desenvolvedor</a>",
    "download": "Descargar",
    "ready": "Listo.",
    "generic_failure": "Fallo.",
    "error_prefix": "Error: {error}",
    "remove": "quitar",
    "queue_default": "Entrando en la cola...",
    "instagram_tab": "Instagram",
    "instagram_title": "Instagram",
    "instagram_sub": "Pega un enlace de Instagram y elige lo que quieres descargar.",
    "instagram_link": "Enlace:",
    "instagram_placeholder": "Pega aqui el enlace de Instagram",
    "instagram_action_video": "Descargar video",
    "instagram_action_transcript": "Descargar la transcripcion del video",
    "instagram_action_images": "Descargar las imagenes del carrusel",
    "instagram_action_ocr": "Descargar el OCR de las imagenes",
    "instagram_note": "Soporta reels, publicaciones y carruseles publicos de Instagram.",
    "instagram_progress": "Preparando...",
    "instagram_meta_counts": "Videos: {videos} \u2022 Im\u00e1genes: {images}",
    "instagram_analyzing": "Analizando enlace de Instagram...",
    "instagram_ready_info": "Enlace de Instagram listo.",
    "instagram_status_video": "Descargando video...",
    "instagram_status_transcript": "Generando transcripcion...",
    "instagram_status_images": "Descargando imagenes...",
    "instagram_status_ocr": "Ejecutando OCR en las imagenes...",
    "instagram_url_required": "Pega primero un enlace de Instagram.",
    "instagram_wait_analysis": "Espera primero el analisis del enlace de Instagram.",
    "instagram_queue": "Entrando en la cola...",
    "instagram_prepare": "Preparando Instagram...",
    "instagram_transcribing": "Transcribiendo audio...",
    "instagram_ready": "Listo.",
    "instagram_failed": "No se pudo procesar el enlace de Instagram.",
    "instagram_invalid_url": "Envía un enlace válido de Instagram.",
    "instagram_info_failed": "No fue posible analizar este enlace de Instagram.",
    "instagram_invalid_action": "Accion de Instagram invalida.",
    "instagram_video_unavailable": "No se encontro ningun video en este enlace de Instagram.",
    "instagram_images_unavailable": "No se encontro ninguna imagen en este enlace de Instagram.",
    "instagram_video_failed": "No se pudo descargar el video de Instagram.",
    "instagram_transcript_empty": "No fue posible generar la transcripcion de este video.",
    "instagram_transcript_failed": "No se pudo generar la transcripcion del video.",
    "instagram_ocr_missing": "Tesseract no encontrado en el servidor.",
    "cookie_banner_title": "Aviso de cookies",
    "cookie_notice": "Usamos cookies para mejorar tu experiencia y analizar el uso del sitio.",
    "cookie_policy_link": "Leer pol\u00edtica de cookies",
    "cookie_accept_all": "Aceptar",
    "cookie_reject_optional": "Rechazar opcionales",
    "cookie_manage": "Gestionar",
    "cookie_preferences_title": "Preferencias de cookies",
    "cookie_preferences_text": "Puedes elegir qu\u00e9 cookies opcionales permitir.",
    "cookie_necessary_title": "Cookies necesarias",
    "cookie_necessary_text": "Esenciales para el funcionamiento del sitio y siempre activas.",
    "cookie_analytics_title": "Cookies anal\u00edticas",
    "cookie_analytics_text": "Ayudan a entender el uso del sitio para mejorar la experiencia.",
    "cookie_always_on": "Siempre activas",
    "cookie_save_preferences": "Guardar preferencias",
    "cookie_accept": "Aceptar"
  },
  "ko": {
    "language_label": "\ud5c8\uc5b8",
    "hero_upload_title": "\ube60\ub978 \uc5c5\ub85c\ub4dc",
    "hero_upload_sub": "\ub4dc\ub798\uadf8, \ub4dc\ub86d, \ubd99\uc5ec\ub123\uae30 \ub610\ub294 \ud074\ub9ad",
    "hero_free_title": "100% \ubb34\ub8cc",
    "hero_free_sub": "\ud504\ub9ac\ubbf8\uc5c4 \uc694\uae08\uc81c \uc5c6\uc74c",
    "hero_safe_title": "\uc548\uc804\ud568",
    "hero_safe_sub": "\ud30c\uc77c\uc774 \ubcf4\uad00\ub418\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4",
    "nav_pdf": "PDF",
    "nav_image": "\uc774\ubbf8\uc9c0",
    "nav_media": "\uc18c\uc15c \ubbf8\ub514\uc5b4",
    "nav_video": "\ub3d9\uc601\uc0c1",
    "tab_ocr": "OCR PDF",
    "tab_merge": "PDF \uc815\ub9ac",
    "tab_rotate": "PDF \ud68c\uc804",
    "tab_split": "PDF \ubd84\ud560",
    "tab_compress": "PDF \uc555\ucd95",
    "tab_protect": "PDF \ubcf4\ud638",
    "tab_removebg": "\ubc30\uacbd \uc81c\uac70",
    "tab_youtube": "YouTube \ubc0f \uc720\uc0ac \uc0ac\uc774\ud2b8 \ub2e4\uc6b4\ub85c\ub4dc",
    "tab_video": "\ub3d9\uc601\uc0c1 \ubd84\ud560",
    "ocr_title": "PDF\uc640 \uc774\ubbf8\uc9c0\ub97c \uac80\uc0c9 \uac00\ub2a5\ud55c \ubb38\uc11c\ub85c \ubcc0\ud658\ud558\uc138\uc694 (OCR)",
    "ocr_sub": "\ud30c\uc77c\ub2f9 \ucd5c\ub300 \ud06c\uae30: {max_mb} MB",
    "upload_cta": "\uc5ec\uae30\ub85c \ud30c\uc77c\uc744 \ub4dc\ub798\uadf8 \uc564 \ub4dc\ub86d\ud558\uac70\ub098, \ubd99\uc5ec\ub123\uac70\ub098, \ud074\ub9ad\ud574\uc11c \uc5c5\ub85c\ub4dc\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4",
    "download_all": "\ubaa8\ub450 \ub2e4\uc6b4\ub85c\ub4dc",
    "ocr_note": "\uc9c0\uc6d0 \ud615\uc2dd: PDF, PNG, JPG, JPEG, TIFF",
    "merge_title": "PDF\uc640 \uc774\ubbf8\uc9c0\ub97c \ud558\ub098\uc758 PDF\ub85c \uc815\ub9ac\ud558\uc138\uc694",
    "merge_sub": "\ucd5c\uc885 \ud30c\uc77c\uc744 \ub9cc\ub4e4\uae30 \uc804\uc5d0 \ucd94\uac00, \ubcd1\ud569, \uc0ad\uc81c\ud558\uace0 \ub4dc\ub798\uadf8\ub85c \uc21c\uc11c\ub97c \ubc14\uafc0 \uc218 \uc788\uc2b5\ub2c8\ub2e4",
    "generate_pdf": "PDF \uc0dd\uc131",
    "rotate_title": "PDF/\uc774\ubbf8\uc9c0 \ud68c\uc804",
    "rotate_sub": "\uc5ec\uae30\uc11c \ud30c\uc77c\uc744 \ud68c\uc804\ud558\uc138\uc694",
    "rotate_now": "\uc9c0\uae08 \ud68c\uc804",
    "split_title": "PDF/\uc774\ubbf8\uc9c0 \ubd84\ud560",
    "split_sub": "PDF \ub610\ub294 \uc774\ubbf8\uc9c0\ub97c \uc5c5\ub85c\ub4dc\ud558\uace0 \ubd84\ud560 \ubc29\uc2dd\uc744 \uc120\ud0dd\ud558\uc138\uc694",
    "split_mode_size": "\ud06c\uae30 \uae30\uc900 (MB)",
    "split_mode_every": "\uace0\uc815 \uac04\uaca9",
    "split_mode_ranges": "\uc0ac\uc6a9\uc790 \uc9c0\uc815 \ubc94\uc704",
    "split_action": "\ubd84\ud560",
    "compress_title": "PDF \uc555\ucd95",
    "compress_sub": "\uc555\ucd95 \uc218\uc900\uc744 \uc120\ud0dd\ud558\uace0 \ud558\ub098 \uc774\uc0c1\uc758 \ud30c\uc77c\uc744 \uc5c5\ub85c\ub4dc\ud558\uc138\uc694",
    "compress_level": "\uc555\ucd95 \uc218\uc900:",
    "compress_max": "\ucd5c\ub300",
    "compress_high": "\ub192\uc74c",
    "compress_medium": "\uc911\uac04",
    "compress_low": "\ub0ae\uc74c",
    "compress_now": "\uc9c0\uae08 \uc555\ucd95",
    "compress_tip": "\ud301: \uc555\ucd95 \uc218\uc900\uc774 \ub192\uc744\uc218\ub85d \ud30c\uc77c \ud488\uc9c8\uc774 \ub354 \ub9ce\uc774 \ub5a8\uc5b4\uc9c8 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
    "protect_title": "\ube44\ubc00\ubc88\ud638\ub85c PDF \ubcf4\ud638",
    "protect_sub": "\ud558\ub098 \uc774\uc0c1\uc758 PDF\ub97c \uc5c5\ub85c\ub4dc\ud558\uace0 \uc120\ud0dd\ud55c \ubaa8\ub4e0 \ud30c\uc77c\uc5d0 \uac19\uc740 \ube44\ubc00\ubc88\ud638\ub97c \uc124\uc815\ud558\uc138\uc694",
    "password": "\ube44\ubc00\ubc88\ud638:",
    "password_confirm": "\ud655\uc778:",
    "password_placeholder": "\ucd5c\uc18c 4\uc790",
    "password_repeat_placeholder": "\ube44\ubc00\ubc88\ud638 \ub2e4\uc2dc \uc785\ub825",
    "protect_now": "\uc9c0\uae08 \ubcf4\ud638",
    "protect_note": "\uc774 \uc791\uc5c5\uc5d0\uc11c \uc5c5\ub85c\ub4dc\ud55c \ubaa8\ub4e0 PDF\uc5d0 \uac19\uc740 \ube44\ubc00\ubc88\ud638\uac00 \uc801\uc6a9\ub429\ub2c8\ub2e4.",
    "removebg_title": "\uc774\ubbf8\uc9c0 \ubc30\uacbd \uc81c\uac70",
    "removebg_sub": "\ud558\ub098 \uc774\uc0c1\uc758 \uc774\ubbf8\uc9c0\ub97c \uc5c5\ub85c\ub4dc\ud574 \ud22c\uba85 \ubc30\uacbd PNG\ub97c \uc0dd\uc131\ud558\uc138\uc694",
    "removebg_strength": "\ucef7\uc544\uc6c3 \uac15\ub3c4",
    "removebg_note": "\uc2ac\ub77c\uc774\ub354\ub97c \uc870\uc815\ud558\uba74 \ucd5c\uc885 PNG\uc758 \ub300\ub7b5\uc801\uc778 \ubbf8\ub9ac\ubcf4\uae30\ub97c \uc2e4\uc2dc\uac04\uc73c\ub85c \ubcfc \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
    "removebg_preview": "\ubbf8\ub9ac\ubcf4\uae30",
    "removebg_preview_hint": "\uccab \ubc88\uc9f8\ub85c \uc5c5\ub85c\ub4dc\ud55c \uc774\ubbf8\uc9c0\uac00 \uc5ec\uae30\uc5d0 \ud45c\uc2dc\ub429\ub2c8\ub2e4.",
    "removebg_action": "\ubc30\uacbd \uc81c\uac70",
    "removebg_formats": "\uc9c0\uc6d0 \ud615\uc2dd: PNG, JPG, JPEG, TIFF. \uacb0\uacfc\ub294 \ud22c\uba85 PNG\ub85c \uc0dd\uc131\ub429\ub2c8\ub2e4.",
    "youtube_title": "YouTube \ubc0f \uc720\uc0ac \uc0ac\uc774\ud2b8 \ub2e4\uc6b4\ub85c\ub4dc",
    "youtube_sub": "\ub9c1\ud06c\ub97c \ubd99\uc5ec\ub123\uace0 \ube44\ub514\uc624 \ub610\ub294 \uc624\ub514\uc624\ub97c \uc120\ud0dd\ud55c \ub4a4 \uc0ac\uc6a9 \uac00\ub2a5\ud55c \ud488\uc9c8\uc744 \uace0\ub974\uc138\uc694",
    "youtube_link": "\ub9c1\ud06c:",
    "youtube_placeholder": "\uc5ec\uae30\uc5d0 \ube44\ub514\uc624 \ub9c1\ud06c\ub97c \ubd99\uc5ec\ub123\uc73c\uc138\uc694",
    "youtube_mode_video": "\ube44\ub514\uc624",
    "youtube_mode_audio": "\uc624\ub514\uc624",
    "youtube_action": "\ud30c\uc77c \uc0dd\uc131",
    "youtube_quality": "\ube44\ub514\uc624 \ud488\uc9c8:",
    "youtube_bitrate": "\uc624\ub514\uc624 \ube44\ud2b8\ub808\uc774\ud2b8:",
    "youtube_progress": "\ub2e4\uc6b4\ub85c\ub4dc \uc900\ube44 \uc911...",
    "youtube_note": "\ud45c\uc2dc\ub418\ub294 \ud488\uc9c8\uc740 YouTube\uc5d0\uc11c \uc81c\uacf5\ud558\ub294 \uc635\uc158\uc5d0 \ub530\ub77c \ub2ec\ub77c\uc9d1\ub2c8\ub2e4.",
    "video_title": "\ud06c\uae30\ubcc4 \ub3d9\uc601\uc0c1 \ubd84\ud560",
    "video_sub": "\ub3d9\uc601\uc0c1\uc744 \uc5c5\ub85c\ub4dc\ud558\uace0 \uac01 \uc870\uac01\uc758 \ud06c\uae30(MB)\ub97c \uc120\ud0dd\ud558\uc138\uc694.",
    "video_upload": "\uc5ec\uae30\ub85c \ub3d9\uc601\uc0c1\uc744 \ub4dc\ub798\uadf8 \uc564 \ub4dc\ub86d\ud558\uac70\ub098, \ubd99\uc5ec\ub123\uac70\ub098, \ud074\ub9ad\ud574\uc11c \uc5c5\ub85c\ub4dc\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4",
    "video_size": "\uc870\uac01\ub2f9 \ud06c\uae30 (MB):",
    "video_action": "\ub3d9\uc601\uc0c1 \ubd84\ud560",
    "video_progress": "\ucc98\ub9ac \uc911...",
    "video_download_all": "\ubaa8\ub4e0 \uc870\uac01 \ub2e4\uc6b4\ub85c\ub4dc",
    "example_size": "\uc608: 6",
    "example_every": "\uc608: 5",
    "example_ranges": "\uc608: 1-3,7,10-12",
    "example_video_size": "\uc608: 100",
    "footer_html": "Gostando das ferramentas? Me pague um café - <span class=\"footer-pix-wrap\"><span class=\"footer-pix\">pix@melotools.com.br</span> <button type=\"button\" class=\"footer-pix-copy\" data-copy-pix=\"pix@melotools.com.br\">Copiar</button></span><br><a href=\"https://instagram.com/meloisonfire\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"footer-link\">Fale com o desenvolvedor</a>",
    "download": "\ub2e4\uc6b4\ub85c\ub4dc",
    "ready": "\uc644\ub8cc.",
    "generic_failure": "\uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4.",
    "error_prefix": "\uc624\ub958: {error}",
    "remove": "\uc81c\uac70",
    "queue_default": "\ub300\uae30\uc5f4\uc5d0 \ucd94\uac00 \uc911...",
    "instagram_tab": "Instagram",
    "instagram_title": "Instagram",
    "instagram_sub": "Instagram ??? ???? ??? ??? ?????.",
    "instagram_link": "??:",
    "instagram_placeholder": "??? Instagram ??? ??????",
    "instagram_action_video": "?? ????",
    "instagram_action_transcript": "?? ?? ??",
    "instagram_action_images": "??? ????",
    "instagram_action_ocr": "??? OCR ???",
    "instagram_note": "?? Instagram ???, ??, ???? ?????.",
    "instagram_progress": "?? ?...",
    "instagram_meta_counts": "??: {videos} ? ???: {images}",
    "instagram_analyzing": "Instagram ?? ?? ?...",
    "instagram_ready_info": "Instagram ?? ?? ??.",
    "instagram_status_video": "?? ???? ?...",
    "instagram_status_transcript": "?? ?? ?...",
    "instagram_status_images": "??? ???? ?...",
    "instagram_status_ocr": "OCR ?? ?...",
    "instagram_url_required": "Instagram ??? ??? ???.",
    "instagram_wait_analysis": "?? Instagram ?? ??? ?????.",
    "instagram_queue": "???? ?? ?...",
    "instagram_prepare": "Instagram ?? ?? ?...",
    "instagram_transcribing": "??? ?? ?...",
    "instagram_ready": "??.",
    "instagram_failed": "Instagram ?? ??? ??????.",
    "instagram_invalid_url": "??? Instagram ??? ?????.",
    "instagram_info_failed": "Instagram ??? ???? ?????.",
    "instagram_invalid_action": "???? ?? Instagram ?????.",
    "instagram_video_unavailable": "? Instagram ???? ??? ?? ? ????.",
    "instagram_images_unavailable": "? Instagram ???? ???? ?? ? ????.",
    "instagram_video_failed": "Instagram ?? ????? ??????.",
    "instagram_transcript_empty": "?? ???? ???? ?????.",
    "instagram_transcript_failed": "?? ??? ??????.",
    "instagram_ocr_missing": "???? Tesseract? ?? ? ????.",
    "cookie_banner_title": "?? ??",
    "cookie_notice": "??? ??? ?? ??? ?? ??? ?????.",
    "cookie_policy_link": "?? ?? ??",
    "cookie_accept_all": "??",
    "cookie_reject_optional": "?? ??",
    "cookie_manage": "??",
    "cookie_preferences_title": "?? ??",
    "cookie_preferences_text": "??? ?? ??? ??? ? ????.",
    "cookie_necessary_title": "?? ??",
    "cookie_necessary_text": "??? ??? ???? ?? ??????.",
    "cookie_analytics_title": "?? ??",
    "cookie_analytics_text": "??? ??? ?? ?? ??? ?????.",
    "cookie_always_on": "?? ??",
    "cookie_save_preferences": "?? ??",
    "cookie_accept": "??"
  }
};

  function getLanguage() {
    const lang = (window.APP_CONFIG && window.APP_CONFIG.currentLang) || document.body.dataset.lang || 'pt';
    return catalog[lang] ? lang : 'pt';
  }

  function format(template, params) {
    return String(template || '').replace(/\{(\w+)\}/g, (_, key) => (params && params[key] != null ? String(params[key]) : ''));
  }

  function t(key, params) {
    const lang = getLanguage();
    const pack = catalog[lang] || catalog.pt;
    const fallback = catalog.pt[key] != null ? catalog.pt[key] : key;
    return format(pack[key] != null ? pack[key] : fallback, params || {});
  }

  function applyTranslations() {
    document.documentElement.lang = getLanguage();
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      let vars = {};
      if (el.dataset.i18nVars) {
        try { vars = JSON.parse(el.dataset.i18nVars); } catch (_e) {}
      }
      const key = el.dataset.i18n;
      const rendered = t(key, vars);
      if (rendered === key) return;
      el.innerHTML = rendered;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      el.setAttribute('placeholder', t(el.dataset.i18nPlaceholder));
    });
    const footer = document.getElementById('footerContent');
    if (footer) footer.innerHTML = t('footer_html');
  }

  function syncLanguagePicker() {
    const lang = getLanguage();
    const options = (window.APP_CONFIG && window.APP_CONFIG.languages) || [];
    const current = options.find((item) => item.code === lang);
    const toggle = document.getElementById('langToggle');
    if (toggle && current) {
      const flag = document.createElement('span');
      flag.className = 'lang-flag';
      flag.setAttribute('aria-hidden', 'true');
      flag.textContent = current.flag || '';
      toggle.replaceChildren(flag);
      toggle.setAttribute('aria-label', `Selecionar idioma, atual: ${current.label}`);
    }
    document.querySelectorAll('[data-lang-option]').forEach((btn) => {
      const active = btn.dataset.langOption === lang;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-checked', active ? 'true' : 'false');
      btn.setAttribute('tabindex', active ? '0' : '-1');
    });
  }

  function setLanguage(lang) {
    const next = catalog[lang] ? lang : 'pt';
    if (window.APP_CONFIG) window.APP_CONFIG.currentLang = next;
    document.body.dataset.lang = next;
    document.cookie = `lang=${next}; path=/; max-age=31536000; samesite=lax`;
    try { localStorage.setItem('ocr-web-lang', next); } catch (_e) {}
    applyTranslations();
    syncLanguagePicker();
    initCookieNotice();
  }

  function initLanguagePicker() {
    const toggle = document.getElementById('langToggle');
    const menu = document.getElementById('langMenu');
    const root = document.getElementById('langPicker');
    if (!toggle || !menu || !root) return;
    const options = Array.from(menu.querySelectorAll('[data-lang-option]'));
    const closeMenu = (restoreFocus) => {
      menu.classList.add('hidden');
      toggle.setAttribute('aria-expanded', 'false');
      if (restoreFocus) toggle.focus();
    };
    const openMenu = (focusIndex) => {
      menu.classList.remove('hidden');
      toggle.setAttribute('aria-expanded', 'true');
      if (typeof focusIndex === 'number' && options.length) {
        options[Math.max(0, Math.min(focusIndex, options.length - 1))].focus();
      }
    };
    toggle.addEventListener('click', (event) => {
      if (menu.classList.contains('hidden')) {
        const activeIndex = options.findIndex((item) => item.getAttribute('aria-checked') === 'true');
        openMenu(event.detail === 0 ? Math.max(0, activeIndex) : undefined);
      } else {
        closeMenu(false);
      }
    });
    toggle.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      event.preventDefault();
      openMenu(event.key === 'ArrowUp' ? options.length - 1 : 0);
    });
    menu.addEventListener('keydown', (event) => {
      const current = options.indexOf(document.activeElement);
      let next = current;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (current + 1) % options.length;
      else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (current - 1 + options.length) % options.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = options.length - 1;
      else if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu(true);
        return;
      } else if (event.key === 'Tab') {
        closeMenu(false);
        return;
      } else {
        return;
      }
      event.preventDefault();
      if (options[next]) options[next].focus();
    });
    document.addEventListener('click', (event) => {
      if (root.contains(event.target)) return;
      closeMenu(false);
    });
    options.forEach((btn) => {
      btn.addEventListener('click', () => {
        setLanguage(btn.dataset.langOption);
        closeMenu(true);
      });
    });
  }

  function getStoredConsent() {
    try {
      const saved = localStorage.getItem('ocr-web-cookie-consent-v2');
      if (saved) return JSON.parse(saved);
    } catch (_e) {}
    const rawCookie = document.cookie.split('; ').find((item) => item.startsWith('cookie_consent='));
    if (!rawCookie) return null;
    try {
      return JSON.parse(decodeURIComponent(rawCookie.split('=')[1] || ''));
    } catch (_e) {
      return null;
    }
  }

  function saveConsent(consent) {
    const payload = JSON.stringify({ necessary: true, analytics: !!consent.analytics, updated_at: new Date().toISOString() });
    document.cookie = `cookie_consent=${encodeURIComponent(payload)}; path=/; max-age=31536000; samesite=lax`;
    try { localStorage.setItem('ocr-web-cookie-consent-v2', payload); } catch (_e) {}
  }

  let analyticsLoaded = false;
  function enableAnalytics() {
    if (analyticsLoaded) return;
    const measurementId = window.APP_CONFIG && window.APP_CONFIG.analyticsMeasurementId;
    if (!measurementId) return;
    analyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ window.dataLayer.push(arguments); };
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
    window.gtag('js', new Date());
    window.gtag('config', measurementId, { anonymize_ip: true });
  }

  function applyConsent(consent) {
    if (consent && consent.analytics) enableAnalytics();
  }

  function initCookieNotice() {
    const banner = document.getElementById('cookieNotice');
    const panel = document.getElementById('cookiePanel');
    const text = document.getElementById('cookieNoticeText');
    const accept = document.getElementById('cookieAccept');
    const reject = document.getElementById('cookieReject');
    const manage = document.getElementById('cookieManage');
    const save = document.getElementById('cookieSave');
    const close = document.getElementById('cookiePanelClose');
    const analytics = document.getElementById('cookieAnalytics');
    if (!banner || !panel || !text || !accept || !reject || !manage || !save || !close || !analytics) return;

    text.textContent = t('cookie_notice');

    const openPanel = () => {
      panel.classList.remove('hidden');
      panel.setAttribute('aria-hidden', 'false');
    };
    const closePanel = () => {
      panel.classList.add('hidden');
      panel.setAttribute('aria-hidden', 'true');
    };
    const showBanner = () => {
      banner.classList.remove('hidden');
      banner.setAttribute('aria-hidden', 'false');
      banner.style.display = 'flex';
    };
    const hideBanner = () => {
      banner.classList.add('hidden');
      banner.setAttribute('aria-hidden', 'true');
      banner.style.display = 'none';
    };

    const currentConsent = getStoredConsent();
    analytics.checked = !!(currentConsent && currentConsent.analytics);
    if (currentConsent) {
      hideBanner();
      applyConsent(currentConsent);
    } else {
      showBanner();
    }

    accept.onclick = () => {
      const consent = { analytics: true };
      analytics.checked = true;
      saveConsent(consent);
      applyConsent(consent);
      hideBanner();
      closePanel();
    };
    reject.onclick = () => {
      const consent = { analytics: false };
      analytics.checked = false;
      saveConsent(consent);
      hideBanner();
      closePanel();
    };
    manage.onclick = () => openPanel();
    close.onclick = () => closePanel();
    save.onclick = () => {
      const consent = { analytics: !!analytics.checked };
      saveConsent(consent);
      applyConsent(consent);
      hideBanner();
      closePanel();
    };
    panel.onclick = (event) => {
      if (event.target === panel) closePanel();
    };
  }

  function apiFetch(url, options) {
    const init = options || {};
    const headers = new Headers(init.headers || {});
    headers.set('X-Lang', getLanguage());
    return fetch(url, { ...init, headers });
  }

  function extractMessage(payload, fallbackKey) {
    if (payload && payload.msg_key) return t(payload.msg_key, payload.msg_params || {});
    if (payload && payload.msg) return payload.msg;
    return fallbackKey ? t(fallbackKey) : t('generic_failure');
  }

  try {
    const saved = localStorage.getItem('ocr-web-lang');
    if (saved && catalog[saved]) {
      if (window.APP_CONFIG) window.APP_CONFIG.currentLang = saved;
      document.body.dataset.lang = saved;
    }
  } catch (_e) {}

  applyTranslations();
  syncLanguagePicker();
  initLanguagePicker();
  initCookieNotice();

  return { t, getLanguage, setLanguage, applyTranslations, apiFetch, extractMessage, syncLanguagePicker };
})();
