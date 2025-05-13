        // 現在の日付
        const today = new Date();
        let currentDate = new Date(today);
        let currentMonth = today.getMonth();
        let currentYear = today.getFullYear();
        
        // 資格一覧（例）
        const resources = [
            "丸山",
            "山下",
        ];
        
        // DOM要素
        const currentDateElement = document.getElementById('current-date');
        const monthYearElement = document.getElementById('month-year');
        const excelTable = document.getElementById('excel-table');
        const monthCalendar = document.getElementById('month-calendar');
        const calendarOverlay = document.getElementById('calendar-overlay');
        const daysContainer = document.getElementById('days');
        const bookingForm = document.getElementById('booking-form');
        const formOverlay = document.getElementById('form-overlay');
        const bookingTitle = document.getElementById('booking-title');
        const shinkanForm = document.getElementById('shinkan-form');
        const shinkanOverlay = document.getElementById('shinkan-form-overlay');
        
        // 月の名前
        const monthNames = [
            '1月', '2月', '3月', '4月', '5月', '6月',
            '7月', '8月', '9月', '10月', '11月', '12月'
        ];
        
        // 曜日の名前
        const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
        
        // 選択された予約情報
        let selectedBooking = {
            date: null,
            time: null,
            resource: null
        };
        
        // カレンダー初期化
        initCalendar();
        
        // イベントリスナー設定
        document.getElementById('prev-date').addEventListener('click', () => {
            currentDate.setDate(currentDate.getDate() - 1);
            updateDateDisplay();
            renderExcelTable();
        });
        
        document.getElementById('next-date').addEventListener('click', () => {
            currentDate.setDate(currentDate.getDate() + 1);
            updateDateDisplay();
            renderExcelTable();
        });
        
        document.getElementById('show-month-view').addEventListener('click', () => {
            showMonthCalendar();
        });
        
        document.getElementById('close-month-view').addEventListener('click', () => {
            hideMonthCalendar();
        });
        
        document.getElementById('prev-month').addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderMonthCalendar();
        });
        
        document.getElementById('next-month').addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderMonthCalendar();
        });
        
        calendarOverlay.addEventListener('click', () => {
            hideMonthCalendar();
        });

        document.getElementById('menu').addEventListener('click', () => {
            showshinkanForm();
        });
        
        document.getElementById('submit-booking').addEventListener('click', () => {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            
            if (!name || !email || !phone) {
                alert('必須項目を入力してください');
                return;
            }
            
            // ここに予約データを送信するコードを追加
            alert('予約が完了しました！');
            
            // フォームをリセット
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('phone').value = '';
            document.getElementById('notes').value = '';
            
            // 予約フォームを閉じる
            hideBookingForm();
            
            // 選択状態をクリア
            selectedBooking = {
                date: null,
                time: null,
                resource: null
            };
            
            // テーブルを再描画
            renderExcelTable();
        });
        
        document.getElementById('cancel-booking').addEventListener('click', () => {
            hideBookingForm();
        });

        document.getElementById('shinkan-ok').addEventListener('click',() => {
          hideshinkanForm();
        })

        document.getElementById('shinkan-cancel').addEventListener('click',() => {
          hideshinkanForm();
        })
        
        function initCalendar() {
            updateDateDisplay();
            renderExcelTable();
        }
        
        function updateDateDisplay() {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const date = currentDate.getDate();
            const dayOfWeek = dayNames[currentDate.getDay()];
            
            currentDateElement.textContent = `${year}年${month + 1}月${date}日(${dayOfWeek})`;
        }
        
        function renderExcelTable() {
            // テーブルをクリア
            excelTable.innerHTML = '';
            
            // ヘッダー行を作成（時間）
            const headerRow = document.createElement('tr');
            
            // 1列目（空セル）
            const emptyHeader = document.createElement('th');
            emptyHeader.className = 'resource-header';
            headerRow.appendChild(emptyHeader);
            
            // 時間ヘッダー（9:00～18:00、30分ごと）
            const startHour = 9;
            const endHour = 18;
            
            for (let hour = startHour; hour <= endHour; hour++) {
                for (let minutes = 0; minutes < 60; minutes += 30) {
                    // 18:30は表示しない
                    if (hour === endHour && minutes > 0) continue;
                    
                    const timeHeader = document.createElement('th');
                    timeHeader.className = 'time-header';
                    timeHeader.textContent = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                    headerRow.appendChild(timeHeader);
                }
            }
            
            excelTable.appendChild(headerRow);
            
            // 資格ごとに行を作成
            resources.forEach((resource, index) => {
                const row = document.createElement('tr');
                
                // 資格名
                const resourceCell = document.createElement('td');
                resourceCell.className = 'resource-name';
                resourceCell.textContent = resource;
                row.appendChild(resourceCell);
                
                // 各時間枠のセルを作成
                for (let hour = startHour; hour <= endHour; hour++) {
                    for (let minutes = 0; minutes < 60; minutes += 30) {
                        // 18:30は表示しない
                        if (hour === endHour && minutes > 0) continue;
                        
                        const timeStr = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                        
                        const cell = document.createElement('td');
                        cell.className = 'time-slot';
                        
                        // ランダムで予約状況を設定（デモ用）
                        const isAvailable = Math.random() > 0.3; // 70%の確率で空き
                        
                        if (isAvailable) {
                            cell.className += ' available';
                            cell.textContent = '○';
                            
                            // 選択状態の確認
                            if (selectedBooking.date && 
                                selectedBooking.date.getFullYear() === currentDate.getFullYear() &&
                                selectedBooking.date.getMonth() === currentDate.getMonth() &&
                                selectedBooking.date.getDate() === currentDate.getDate() &&
                                selectedBooking.time === timeStr &&
                                selectedBooking.resource === resource) {
                                cell.className += ' selected';
                            }
                            
                            // クリックイベント
                            cell.addEventListener('click', () => {
                                selectedBooking = {
                                    date: new Date(currentDate),
                                    time: timeStr,
                                    resource: resource
                                };
                                showBookingForm(timeStr);
                            });
                        } else {
                            cell.className += ' booked';
                            cell.textContent = '×';
                        }
                        
                        row.appendChild(cell);
                    }
                }
                
                excelTable.appendChild(row);
            });
        }
        
        function showMonthCalendar() {
            renderMonthCalendar();
            monthCalendar.style.display = 'block';
            calendarOverlay.style.display = 'block';
        }
        
        function hideMonthCalendar() {
            monthCalendar.style.display = 'none';
            calendarOverlay.style.display = 'none';
        }
        
        function renderMonthCalendar() {
            // 月と年の表示を更新
            monthYearElement.textContent = `${currentYear}年 ${monthNames[currentMonth]}`;
            
            // 日付コンテナをクリア
            daysContainer.innerHTML = '';
            
            // 月の最初の日と最後の日を取得
            const firstDay = new Date(currentYear, currentMonth, 1);
            const lastDay = new Date(currentYear, currentMonth + 1, 0);
            
            // 前月の日数を取得
            const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
            
            // 月の最初の日の曜日を取得（0-6、0は日曜日）
            const firstDayIndex = firstDay.getDay();
            
            // 月の最後の日の日付を取得
            const lastDayDate = lastDay.getDate();
            
            // 翌月の日数を表示するためのカウンター
            let nextMonthDay = 1;
            
            // 42個のセル（6行 x 7列）を生成
            for (let i = 0; i < 42; i++) {
                const dayElement = document.createElement('div');
                dayElement.classList.add('day');
                
                // 前月の日付
                if (i < firstDayIndex) {
                    const prevMonthDay = prevMonthLastDay - (firstDayIndex - i - 1);
                    dayElement.textContent = prevMonthDay;
                    dayElement.classList.add('other-month');
                } 
                // 当月の日付
                else if (i < firstDayIndex + lastDayDate) {
                    const dayNumber = i - firstDayIndex + 1;
                    dayElement.textContent = dayNumber;
                    
                    // 今日の日付をハイライト
                    if (currentYear === today.getFullYear() && 
                        currentMonth === today.getMonth() && 
                        dayNumber === today.getDate()) {
                        dayElement.classList.add('today');
                    }
                    
                    // 選択された日付をハイライト
                    if (currentDate.getFullYear() === currentYear && 
                        currentDate.getMonth() === currentMonth && 
                        currentDate.getDate() === dayNumber) {
                        dayElement.classList.add('selected');
                    }
                    
                    // 日付クリック時のイベント
                    dayElement.addEventListener('click', () => {
                        currentDate = new Date(currentYear, currentMonth, dayNumber);
                        updateDateDisplay();
                        renderExcelTable();
                        hideMonthCalendar();
                    });
                } 
                // 翌月の日付
                else {
                    dayElement.textContent = nextMonthDay++;
                    dayElement.classList.add('other-month');
                }
                
                daysContainer.appendChild(dayElement);
            }
        }
        
        function showBookingForm(timeStr) {
            // 予約フォームのタイトルを設定
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const date = currentDate.getDate();
            const dayOfWeek = dayNames[currentDate.getDay()];
            
            bookingTitle.textContent = `${year}年${month + 1}月${date}日(${dayOfWeek}) ${selectedBooking.time} ${selectedBooking.resource}`;
            document.getElementById("starttime").value = timeStr
            document.getElementById("endtime").value = addMinutes(timeStr, 30);
            
            // 予約フォームを表示
            bookingForm.style.display = 'block';
            formOverlay.style.display = 'block';
        }

        function showshinkanForm() {
            // 予約フォームのタイトルを設定
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const date = currentDate.getDate();
            const dayOfWeek = dayNames[currentDate.getDay()];
            
            bookingTitle.textContent = `${year}年${month + 1}月${date}日(${dayOfWeek}) ${selectedBooking.time} ${selectedBooking.resource}`;
            
            // 予約フォームを表示
            shinkanForm.style.display = 'block';
            shinkanOverlay.style.display = 'block';
        }
        
        function hideBookingForm() {
            bookingForm.style.display = 'none';
            formOverlay.style.display = 'none';
        }

        function hideshinkanForm() {
          shinkanForm.style.display = 'none';
          shinkanOverlay.style.display = 'none';
      }

      function addMinutes(timeStr, minutes) {
          // "09:00" を "09:00:00" にして Date オブジェクトに変換
          let [hours, minutesStr] = timeStr.split(":");
          let date = new Date();
          date.setHours(parseInt(hours));
          date.setMinutes(parseInt(minutesStr));
      
          // 指定の分数を追加
          date.setMinutes(date.getMinutes() + minutes);
      
          // フォーマットを調整して戻す
          let newHours = String(date.getHours()).padStart(2, "0");
          let newMinutes = String(date.getMinutes()).padStart(2, "0");
          return `${newHours}:${newMinutes}`;
      }
    
    