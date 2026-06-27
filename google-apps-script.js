const SHEET_ID = '1JaG7q7o2G0MWivZYhr9jUD20okufRsm_6ZvMDUg2KVA';
const SHEET_NAME = 'Trang tính 1'; // Thay đổi nếu tên sheet của bạn khác (ví dụ: 'Sheet1')

// Hàm POST nhận dữ liệu từ Landing Page
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    
    // Lấy thời gian hiện tại
    const timestamp = new Date();
    
    // Đọc dữ liệu từ form trên landing page (vì ta gửi bằng URLSearchParams nên data nằm trong e.parameter)
    const name = e.parameter.name || '';
    const email = e.parameter.email || '';
    const phone = e.parameter.phone || '';
    const channel = e.parameter.channel || '';
    const timing = e.parameter.timing || '';
    const note = e.parameter.note || '';
    
    // Thêm 1 dòng mới vào Google Sheet (Thứ tự cột tương ứng: Thời gian, Họ tên, Email, SĐT, Kênh, Thời gian tư vấn, Ghi chú)
    sheet.appendRow([timestamp, name, email, phone, channel, timing, note]);
    
    // Trả kết quả JSON cho Client (để Landing page biết là đã lưu thành công)
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    // Xử lý lỗi nếu xảy ra
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
