const fpsSlider = document.getElementById('fps-slider');
        const fpsValue = document.getElementById('fps-value');

        fpsSlider.addEventListener('input', function() {
            fpsValue.textContent = `FPS: ${fpsSlider.value}`;
        });

        //Get text from input file
        const fileInput = document.getElementById('file-input');
        const inputText = document.getElementById('input-text');

        fileInput.addEventListener('change', function(event) {
            const file = event.target.files[0]; // Lấy file được chọn

            if (file) {
                const formData = new FormData();
                formData.append('file', file);

                // Gửi file lên Flask API để xử lý
                fetch('/upload', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.type === "text" || data.type === "audio") {
                        inputText.value = data.content; // Hiển thị nội dung trong textarea
                    } else {
                        alert('Có lỗi xảy ra khi xử lý tệp.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Có lỗi xảy ra khi gửi tệp.');
                });
            }
        });
        const soundBtn = document.getElementById('sound-btn');

        // Kiểm tra nếu trình duyệt hỗ trợ Web Speech API
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();

            recognition.lang = 'vi-VN'; // Đặt ngôn ngữ nhận diện giọng nói (ví dụ: tiếng Việt)
            recognition.continuous = false; // Không lặp lại liên tục
            recognition.interimResults = false; // Không hiển thị kết quả tạm thời

            // Khi bắt đầu nhận diện giọng nói, thay đổi giao diện nút "Sound"
            recognition.onstart = function() {
                soundBtn.textContent = "Đang nghe...";
                soundBtn.disabled = true; // Vô hiệu hóa nút khi micro đang lắng nghe
            };

            // Khi nhận diện được giọng nói
            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript; // Lấy kết quả văn bản
                inputText.value += transcript; // Thêm văn bản vào textarea
            };

            // Khi kết thúc nhận diện giọng nói, khôi phục lại nút
            recognition.onend = function() {
                soundBtn.textContent = "Sound";
                soundBtn.disabled = false; // Bật lại nút khi kết thúc nhận diện
            };

            // Khi người dùng bấm vào nút Sound, bắt đầu nhận diện giọng nói
            soundBtn.addEventListener('click', function() {
                recognition.start(); // Bắt đầu nhận diện giọng nói
            });

            // Xử lý các lỗi (nếu có)
            recognition.onerror = function(event) {
                console.error("Lỗi nhận diện giọng nói:", event.error);
                soundBtn.textContent = "Sound";
                soundBtn.disabled = false; // Bật lại nút khi có lỗi
            };
        } else {
            // Nếu trình duyệt không hỗ trợ Web Speech API
            soundBtn.addEventListener('click', function() {
                alert('Trình duyệt của bạn không hỗ trợ nhận diện giọng nói.');
            });
        }