# Upload và Parse CSV với Laravel MediaLibrary và SpreadsheetReader

# Giới thiệu

Hôm nay mình xin giới thiệu 1 cách làm khác để upload & xử lý file csv trong Laravel.

Đây là một đoạn code tôi đã viết gần đây. Nhiệm vụ rất đơn giản - tải lên CSV và phân tích nó. Cũng lưu file đó và bản ghi, người dùng đã tải nó lên. Hãy cùng xem.

Ở đây, mã của phương thức điều khiển, tôi sẽ giải thích từng chút một:

```php
public function importProcess(UploadImportModelRequest $request)
{
    $originalFile   = $request->file('import_file');
    $import = Import::create([
        'filename' => $originalFile->getClientOriginalName(),
        'user_id' => auth()->id(),
    ]);

    $file = $import->addMediaFromRequest('import_file')
        ->toMediaCollection('imports');

    $filename = storage_path('app/' . $file->id . '/' . $file->file_name);
    $reader = new \SpreadsheetReader($filename);
    foreach ($reader as $row) {
        // Parsing the rows...
    }
}
```

## Bước 1: Validation FormRequest

Xem các tham số trong class `UploadImportModelRequest`? Nó chỉ giúp chúng ta xác nhận rằng file đó tồn tại trên thực tế, và là file CSV hoặc TXT.

`app/Http/Requests/UploadImportModelRequest.php:`

```php
class UploadImportModelRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'import_file' => [
                'required',
                'file',
                'mimes:csv,txt'
            ],
        ];
    }
}
```

Đọc thêm về các rules cho file trong bài viết này: https://laraveldaily.com/four-laravel-validation-rules-for-images-and-photos/.

## Bước 2: Upload File with Laravel MediaLibrary

Package này (https://github.com/spatie/laravel-medialibrary) có lẽ là phổ biến nhất để tải lên tệp trong Laravel, và đây là lý do tại sao - bạn có thể làm rất nhiều thứ trong một vài dòng code.

Nhưng trước tiên, chúng ta cần lưu trữ bản ghi nhập thực tế đã xảy ra và lấy model Eloquent cho nó:

```php
$originalFile   = $request->file('import_file');
$import = Import::create([
    'filename' => $originalFile->getClientOriginalName(),
    'user_id' => auth()->id(),
]);
```

Vì vậy, chúng tôi lưu trữ tên file gốc, bất kể đó là gì, như “dummy import test.csv”, hoặc một cái gì đó tương tự. Tôi sẽ sớm cho bạn thấy lý do tại sao mà bản gốc là quan trọng.

Kết quả của truy vấn Eloquent đó là đối tượng `$import` và đó là nơi mà Laravel MediaLibrary trở nên tiện dụng - trong một dòng code chúng ta có thể lưu trữ file vào một thư mục và cũng gán tệp đó cho đối tượng `$import`:

```php
$file = $import->addMediaFromRequest('import_file')
    ->toMediaCollection('imports');
```

Kết quả của việc này là:

- Bản ghi DB mới được lưu trữ trong bảng `media` với tên tệp và mối quan hệ với đối tượng `$import`;
- Một thư mục được tạo trong thư mục `storage/app`, với ID của bản ghi media;
- Bên trong thư mục mới đó - file tải lên được lưu trữ;
- Object của bản ghi `media` đó được return trong `$file`.

## Bước 3: Lấy tên thfile và phân tích cú pháp CSV

Điều quan trọng là Laravel MediaLibrary đã đổi tên file để biến nó thành Sluggable, vì vậy tên file thực tế khác với tên gốc. Bạn có thể xem sự khác biệt về tên file và bản ghi trong bảng `media` trong DB:

![](https://laraveldaily.com/wp-content/uploads/2019/08/laravel-medialibrary-rename-files-1024x556.png)

Đó là lý do tại sao chúng ta cần đọc file CSV với tên mới của nó, được lưu trữ bên trong đối tượng `$file`.

```php
$filename = storage_path('app/' . $file->id . '/' . $file->file_name);
$reader = new \SpreadsheetReader($filename);
foreach ($reader as $row) {
    // Parsing the rows...
}
```

Như bạn có thể thấy, hiện tại chúng ta trang truy cập đến file ở `storage/[media.id]/[media.file_name]`.

# Kết luận

Trong ví dụ này, tôi đã không phân tích CSV một cách chi tiết, vì nó rất riêng lẻ, nhưng tôi khuyên bạn nên sử dụng package Spreadsheet Reader (https://github.com/nuovo/spreadsheet-reader). Tuy nó khá cũ, nhưng vì nó hoạt động nhanh hơn nhiều so với Laravel Excel (https://laravel-excel.com/) hoặc các package khác.

Hy vọng bài viết này của tôi sẽ giúp các bạn áp dụng được nó vào dự án của mình.

Cảm ơn các bạn đã đọc bài viết!

# Tham khảo

https://laraveldaily.com/upload-and-parse-csv-with-laravel-medialibrary-and-spreadsheetreader/
