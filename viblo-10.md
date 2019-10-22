# 40 Validation Rules Nâng Cao Trong Laravel

## Giới thiệu
Hệ thống xác thực Laravel có sẵn hơn [60 validation rules](https://laravel.com/docs/5.8/validation#available-validation-rules), nhưng nếu bạn muốn thêm gì thì sao? Bạn có thể dễ dàng [tạo validation rules của riêng mình](https://laraveldaily.com/how-to-create-custom-validation-rules-laravel/) hoặc sử dụng một cái gì đó đã có sẵn trên internet. Hãy cùng tìm hiểu xem.

## 22 Rules Bảng chữ cái

Đầu tiên, chúng ta bắt đầu với một loạt các bài viết của [Matt Kingshott](https://twitter.com/mattkingshott), senior developer tại [Alphametric](https://twitter.com/alphametric_co), ông đã viết khá nhiều bài đăng trên Medium và thêm tất cả các rules vào [Github Repository](https://github.com/alphametric/laravel-validation-rules). Danh sách các rules có sẵn ở đây:

* StrongPassword: kiểm tra độ mạnh của mật khẩu
* TelephoneNumber: số điện thoại hợp lệ
* RecordOwner: Yêu cầu id id người dùng được xác thực khớp với cột user_id trên bản ghi cơ sở dữ liệu đã cho, ví dụ: chủ sở hữu: bài viết, id
* MonetaryFigure: con số tiền tệ, ví dụ $ 72,33
* DisposableEmail: địa chỉ email không dùng một lần
* DoesNotExist: giá trị không có trong bảng / cột cơ sở dữ liệu nhất định
* Decimal: thập phân với định dạng phù hợp
* EncodedImage: value là hình ảnh được mã hóa base64 của loại mime đã cho
* LocationCoordinates: tập hợp các tọa độ vĩ độ và kinh độ được phân tách bằng dấu phẩy
* FileExists: value là đường dẫn đến tệp hiện có
* Equals: giá trị bằng với giá trị đã cho khác
* MacAddress: value là một địa chỉ MAC hợp lệ
* ISBN: giá trị là số ISBN-10 hoặc ISBN-13 hợp lệ
* EndsWith: giá trị kết thúc bằng một chuỗi đã cho
* EvenNumber: value là số chẵn (số thập phân được chuyển đổi đầu tiên bằng cách sử dụng intval)
* OddNumber: value là một số lẻ (số thập phân được chuyển đổi đầu tiên bằng cách sử dụng intval)
* Lowercase: value là một chuỗi chữ thường
* Uppercase: value là một chuỗi chữ hoa
* Titlecase: value là một chuỗi Titlecase
* Domain: giá trị là một miền, ví dụ: google.com, www.google.com
* CitizenIdentification: giá trị id số nhận dạng công dân của Hoa Kỳ, Vương quốc Anh hoặc Pháp
* WithoutWhitespace: value không bao gồm bất kỳ ký tự khoảng trắng nào

## 8 Rules của Scott Robinson
Một validation rules tốt khác được thực hiện bởi [Scott Robinson](https://github.com/ssx?tab=repositories), người đã tạo ra một trang web đặc biệt [laravel-validation-rules.github.io](https://laravel-validation-rules.github.io/). Nó có các rules sau:

* Colour: Xác thực màu sắc, hiện chỉ hỗ trợ mã hex.
* Country Codes: Xác thực mã quốc gia 2 & 3 ký tự.
* Credit Card: rules này sẽ xác thực rằng một số thẻ tín dụng nhất định, ngày hết hạn hoặc cvc là hợp lệ.
* IP: Xác thực một địa chỉ IP là công khai hoặc riêng tư. Hỗ trợ ipv4 & ipv6.
* Phone: Xác thực định dạng số điện thoại.
* Subdomain: Xác thực người dùng gửi tên miền phụ trong ứng dụng của bạn.
* Timezone: rules này sẽ xác thực rằng một múi giờ nhất định là hợp lệ trong cơ sở dữ liệu thời gian của hệ thống.
* US State: Xác thực các tiểu bang Hoa Kỳ và Canada.

## 5 Rules của Spatie

Team Spatie cũng có kho lưu trữ của riêng họ với một vài rules:

* Authorized: người dùng được ủy quyền để thực hiện một khả năng trên một thể hiện của mô hình đã cho.
* CountryCode: trường là mã quốc gia ISO3166 hợp lệ.
* Enum: value là một phần của lớp enum đã cho, như myclabs / php-enum.
* ModelsExist: tất cả các giá trị trong mảng đầu vào tồn tại dưới dạng các thuộc tính cho lớp mô hình đã cho.
* Delimited: chuỗi chứa các giá trị được phân tách, như ‘sebastian@example.com, alex@example.com.

## 5 Rules của Pineco.de

Cuối cùng, [Gergő D. Nagy](https://twitter.com/_iamgergo) từ Pineco.de đã [xuất bản một bài viết vào cuối năm 2017](https://pineco.de/handy-validation-rules-in-laravel/), với một rule xác thực và một [repository](https://github.com/thepinecode/validation-rules). Nó đã không được cập nhật kể từ đó, vì vậy hãy sử dụng một cách thận trọng. Các rules là:
* Kiểm tra mật khẩu người dùng
* Số lẻ hoặc số chẵn
* Giá trị chỉ có thể được tăng lên
* Giá trị chứa các từ cụ thể
* Ngày phải là một ngày trong tuần

Tôi còn thiếu gì nữa không? Các bạn hãy để lại comment cho tôi nhé.

# Tham khảo
https://laraveldaily.com/40-additional-laravel-validation-rules/
