const SPREADSHEET_ID = '1JaG7q7o2G0MWivZYhr9jUD20okufRsm_6ZvMDUg2KVA';

function doPost(e) {
  try {
    // 1. Mở file Google Sheet bằng ID
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // 2. Lấy Sheet đầu tiên (không cần lo sai tên 'Trang tính 1' hay 'Sheet1' nữa)
    const sheet = ss.getSheets()[0]; 
    
    // 3. Lấy dữ liệu gửi từ form. Trong trường hợp này nó nằm ở e.parameter
    const p = e.parameter || {};

    // 4. Tạo các trường tự động
    const timestamp = new Date();
    
    let randomNumbers = '';
    for (let i = 0; i < 10; i++) {
      randomNumbers += Math.floor(Math.random() * 10).toString();
    }
    const orderCode = 'AI' + randomNumbers;
    const amount = '19.000đ';

    // 5. Chuẩn bị dòng dữ liệu cần chèn
    const rowData = [
      timestamp,                      // Cột A: Thời gian
      p.name || '',                   // Cột B: Họ và tên
      p.email || '',                  // Cột C: Email
      p.phone || '',                  // Cột D: Số điện thoại
      p.channel || '',                // Cột E: Kênh tư vấn
      p.timing || '',                 // Cột F: Thời gian thuận tiện
      p.note || '',                   // Cột G: Ghi chú
      orderCode,                      // Cột H: Mã đơn hàng
      amount                          // Cột I: Số tiền
    ];

    // 6. Ghi dữ liệu vào Sheet
    sheet.appendRow(rowData);

    // Trả về JSON thành công
    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
                         .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // NẾU CÓ LỖI: Ghi thẳng chi tiết lỗi vào Sheet để dễ tìm nguyên nhân
    try {
      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      const sheet = ss.getSheets()[0];
      sheet.appendRow([new Date(), "LỖI HỆ THỐNG", error.toString(), JSON.stringify(e || {})]);
    } catch (err) {} // Bỏ qua nếu lỗi cả phần ghi lỗi
    
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "message": error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

// Bắt buộc phải có để tránh lỗi CORS trong một số trường hợp
function doOptions(e) {
  return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
                       .setMimeType(ContentService.MimeType.JSON);
}
