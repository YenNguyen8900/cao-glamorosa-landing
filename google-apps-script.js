const SHEET_ID = '1JaG7q7o2G0MWivZYhr9jUD20okufRsm_6ZvMDUg2KVA';
const SHEET_NAME = 'Trang tính 1'; // Thay đổi nếu tên sheet của bạn khác (ví dụ: 'Sheet1')

// Hàm POST nhận dữ liệu từ Landing Page
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    
    // Lấy thời gian hiện tại
    const timestamp = new Date();
    
    let data = {};
    
    // Kiểm tra xem dữ liệu gửi lên là dạng JSON hay Form-urlencoded
    if (e.postData && e.postData.type === "application/json") {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter; // Form-urlencoded (URLSearchParams)
    }

    // Lấy các trường dữ liệu
    const name = data.name || '';
    const email = data.email || '';
    const phone = data.phone || '';
    const channel = data.channel || '';
    const timing = data.timing || '';
    const note = data.note || '';
    
    // Thêm 1 dòng mới vào Google Sheet (Thứ tự cột tương ứng: Thời gian, Họ tên, Email, SĐT, Kênh, Thời gian tư vấn, Ghi chú)
    sheet.appendRow([timestamp, name, email, phone, channel, timing, note]);
    
    // Trả kết quả JSON cho Client (CORS)
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    // Xử lý lỗi nếu xảy ra
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Cấu hình OPTIONS để vượt qua kiểm tra CORS nếu client gọi fetch mode 'cors'
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}
