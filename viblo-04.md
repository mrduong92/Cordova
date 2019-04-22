# Insert tốc độ cao trong MySQL

# Giới thiệu

Khi bạn cần insert hàng triệu bản ghi vào cơ sở dữ liệu MySQL, bạn sẽ sớm nhận ra rằng việc gửi từng câu lệnh INSERT không phải là một giải pháp khả thi. Tài liệu MySQL có một số mẹo tối ưu hóa INSERT đáng để đọc bắt đầu.
Tôi sẽ cố gắng tóm tắt ở đây hai kỹ thuật chính để tải dữ liệu vào cơ sở dữ liệu MySQL một cách hiệu quả.

# LOAD DATA INFILE

Nếu bạn đang tìm kiếm hiệu suất thô, đây không phải là giải pháp bạn lựa chọn. LOAD DATA INFILE là một tuyên bố cụ thể, được tối ưu hóa cho MySQL, trực tiếp insert dữ liệu vào bảng từ file CSV / TSV.
Có hai cách để sử dụng LOAD DATA INFILE. Bạn có thể sao chép file dữ liệu vào thư mục dữ liệu của máy chủ (thường là / var / lib / mysql-files /) và chạy:

```mysql
LOAD DATA INFILE '/path/to/products.csv' INTO TABLE products;
```

Điều này khá cồng kềnh vì nó đòi hỏi bạn phải có quyền truy cập vào hệ thống tập tin máy chủ, đặt quyền thích hợp, v.v. Tin vui là, bạn cũng có thể lưu trữ file dữ liệu ở phía máy khách và sử dụng từ khóa LOCAL:

```mysql
LOAD DATA LOCAL INFILE '/path/to/products.csv' INTO TABLE products;
```

Trong trường hợp này, file được đọc từ hệ thống file máy khách, được sao chép trong suốt vào thư mục temp máy chủ và được nhập từ đó. Nói chung, nó nhanh như tải trực tiếp từ hệ thống tập tin máy chủ. Bạn cần phải đảm bảo rằng tùy chọn này được bật trên máy chủ của bạn, mặc dù.

Có nhiều tùy chọn để LOAD DATA INFILE, chủ yếu liên quan đến cách cấu trúc file dữ liệu của bạn (dấu phân cách trường, bao vây, ...). Có một cái nhìn vào các tài liệu để xem tất cả.

Mặc dù LOAD DATA INFILE là tùy chọn hiệu suất tốt nhất của bạn, nhưng nó yêu cầu bạn phải sẵn sàng dữ liệu của mình dưới dạng file văn bản được phân tách bằng dấu phân cách. Nếu bạn không có các file như vậy, bạn sẽ cần phải sử dụng các tài nguyên bổ sung để tạo chúng và có thể sẽ thêm một mức độ phức tạp cho ứng dụng của bạn. May mắn thay, có một sự thay thế.

# Insert mở rộng

Một câu lệnh SQL INSERT điển hình trông giống như:

```mysql
INSERT INTO user (id, name) VALUES (1, 'Dat');
```

Một lệnh INSERT mở rộng nhóm một số bản ghi thành một truy vấn duy nhất:
```mysql
INSERT INTO user (id, name) VALUES (1, 'Dat'), (2, 'Messi');
```
Chìa khóa ở đây là tìm số lần insert tối ưu cho mỗi truy vấn để gửi. Không có số một cỡ vừa cho tất cả, vì vậy bạn cần điểm chuẩn một mẫu dữ liệu của mình để tìm ra giá trị mang lại hiệu suất tối đa hoặc đánh đổi tốt nhất về mức độ sử dụng / hiệu suất bộ nhớ.

Để tận dụng tối đa các phần insert mở rộng, bạn cũng nên:

- sử dụng prepared statements
- chạy các câu lệnh trong một transaction

# Hiệu năng
Tôi đã insert 1,2 triệu hàng, trung bình 6 cột loại hỗn hợp, trung bình ~ 26 byte mỗi hàng. Tôi đã thử nghiệm hai cấu hình phổ biến:

Máy khách và máy chủ trên cùng một máy, giao tiếp qua ổ cắm UNIX
Máy khách và máy chủ trên các máy riêng biệt, trên mạng Gigabit có độ trễ rất thấp (<0,1 ms)
Để làm cơ sở cho việc so sánh, tôi đã sao chép bảng bằng cách sử dụng INSERT LỰA CHỌN, đạt hiệu suất là 313.000 lần insert / giây.

## LOAD DATA INFILE
Thật ngạc nhiên, LOAD DATA INFILE chứng minh nhanh hơn bản sao bảng:

LOAD DATA INFILE: 377.000 lần insert / giây
LOAD DATA LOCAL INFILE qua mạng: 322.000 lần insert / giây
Sự khác biệt giữa hai số dường như liên quan trực tiếp đến thời gian cần thiết để truyền dữ liệu từ máy khách đến máy chủ: file dữ liệu có kích thước 53 MiB và chênh lệch thời gian giữa 2 điểm chuẩn là 543 ms, điều này sẽ đại diện cho tốc độ truyền 780 mbps, gần với tốc độ Gigabit.

Điều này có nghĩa là, trong nhiều khả năng, máy chủ MySQL không bắt đầu xử lý file cho đến khi nó được chuyển hoàn toàn: do đó tốc độ insert của bạn liên quan trực tiếp đến băng thông giữa máy khách và máy chủ, điều quan trọng là phải tính đến nếu chúng không nằm trên cùng một máy.

## Inserts mở rộng
Tôi đã đo tốc độ insert bằng cách sử dụng thư viện có tên là BulkInserter, với tối đa 10.000 lần insert cho mỗi truy vấn:

![](https://cdn-images-1.medium.com/max/1600/1*k_QS1qtgN5-UyrDkjSRg_w.png)

Như chúng ta có thể thấy, tốc độ insert tăng nhanh khi số lần insert trên mỗi truy vấn tăng. Chúng tôi đã tăng hiệu suất 6 × trên localhost và tăng 17 × qua mạng, so với tốc độ INSERT tuần tự:

40.000 → 247.000 insert / giây trên localhost
12.000 → 201.000 insert / giây qua mạng
Phải mất khoảng 1.000 lần insert cho mỗi truy vấn để đạt được thông lượng tối đa trong cả hai trường hợp, nhưng 40 lần insert cho mỗi truy vấn là đủ để đạt được 90% thông lượng này trên localhost, đây có thể là một sự đánh đổi tốt ở đây. Nó cũng rất quan trọng để lưu ý rằng sau một đỉnh, hiệu suất thực sự giảm khi bạn đưa vào nhiều insert hơn cho mỗi truy vấn.

Lợi ích của việc insert mở rộng cao hơn qua mạng, vì tốc độ insert tuần tự trở thành chức năng của độ trễ của bạn:
```
số bản ghi tuần tự được insert mỗi giây ~= 1000 / ping (đơn vị milliseconds)
```

Độ trễ giữa máy khách và máy chủ càng cao, bạn càng được hưởng lợi từ việc sử dụng các phần insert mở rộng.

# Kết luận
Như mong đợi, LOAD DATA INFILE là giải pháp ưa thích khi tìm kiếm hiệu năng thô trên một kết nối duy nhất. Nó yêu cầu bạn chuẩn bị một file được định dạng đúng, vì vậy nếu bạn phải tạo file này trước, hãy đảm bảo tính đến điều đó khi đo tốc độ insert.

Mặt khác, các phần insert mở rộng, không yêu cầu file văn bản tạm thời và có thể cung cấp cho bạn khoảng 65% thông lượng LOAD DATA INFILE, đây là tốc độ insert rất hợp lý. Thật thú vị khi lưu ý rằng nó không quan trọng cho dù bạn có sử dụng localhost hay qua mạng hay không, việc nhóm một số insert trong một truy vấn duy nhất luôn mang lại hiệu suất tốt hơn.

Nếu bạn quyết định sử dụng các phần insert mở rộng, hãy chắc chắn kiểm tra môi trường của bạn bằng một mẫu dữ liệu thực tế của bạn và một vài cấu hình insert cho mỗi truy vấn khác nhau trước khi quyết định giá trị nào phù hợp nhất với bạn.

Hãy cẩn thận khi tăng số lượng insert trên mỗi truy vấn, vì nó có thể yêu cầu bạn phải:
- phân bổ thêm bộ nhớ cho phía khách hàng
- tăng cài đặt `max_allowed_packet` trên máy chủ MySQL

Một lưu ý cuối cùng, điều đáng nói là theo Percona, bạn có thể đạt được hiệu suất cao hơn nữa bằng cách sử dụng các kết nối đồng thời, phân vùng và nhiều vùng đệm.
