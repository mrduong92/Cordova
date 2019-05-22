# Nén ảnh trước khi upload trong Laravel 5.8

# Giới thiệu

Nếu bạn muốn nén hình ảnh trong ứng dụng Laravel 5.8 thì đó là 1 sự thích hợp. Mình sẽ hướng dẫn bạn cách nén hình ảnh trước khi tải lên bằng cách sử dụng can thiệp trong Laravel. chúng ta có thể dễ dàng thu nhỏ hình ảnh hoặc nén hình ảnh trong Laravel. Sau đó, chúng ta có thể dễ dàng nén hình ảnh của png, jpeg, jpg, gif, svg, v.v.

chúng mình sẽ sử dụng gói can thiệp / hình ảnh để nén hoặc thay đổi kích thước hình ảnh trong Laravel. can thiệp cung cấp một chức năng thay đổi kích thước sẽ có ba tham số. Ba tham số là chiều rộng, chiều cao và callback function, callback function là một tùy chọn.

Vì vậy, ở đây mình viết hướng dẫn từng bước của hình ảnh nén trong Laravel. Vì vậy, chỉ cần làm theo bước dưới đây để tạo ví dụ hình ảnh cho dự án của bạn.

![](https://itsolutionstuff.com/upload/laravel-compress-image.jpg)

## Bước 1: Cài đặt Laravel 5.8

Trong bước này, nếu bạn chưa thiết lập ứng dụng laravel 5.8 thì chúng ta phải tải ứng dụng laravel 5.8 mới. Vì vậy, chạy lệnh dưới đây và nhận được ứng dụng laravel 5,8 sạch.

```sh
composer create-project --prefer-dist laravel/laravel blog
```

## Bước 1: Cài đặt Intervention Image

Trong bước thứ hai, mình sẽ cài đặt can thiệp / hình ảnh để thay đổi kích thước hình ảnh. gói này thông qua mình có thể tạo hình ảnh thu nhỏ cho dự án của mình. Vì vậy, lệnh bellow đầu tiên trong cmd hoặc terminal của bạn:

```sh
composer require intervention/image
```

Bây giờ chúng ta cần thêm đường dẫn nhà cung cấp và đường dẫn bí danh trong file `config/app.php` để mở file đó và thêm mã dưới đây.

* config/app.php

```php
return [

    ......

    $provides => [

        ......

        ......,

        'Intervention\Image\ImageServiceProvider'

    ],

    $aliases => [

        .....

        .....,

        'Image' => 'Intervention\Image\Facades\Image'

    ]

]
```

## Bước 3: Tạo routes

Trong bước này, mình sẽ thêm các tuyến đường và file trình điều khiển để trước tiên thêm tuyến đường dưới trong file tuyến.php của bạn.

* routes/web.php

```php
Route::get('resizeImage', 'ImageControllerer@resizeImage');
Route::post('resizeImagePost', 'ImageController@resizeImagePost')->name('resizeImagePost');
```

## Bước 4: Tạo Controller File

Bây giờ yêu cầu tạo ImageController mới để tải lên hình ảnh và thay đổi kích thước hình ảnh để trước tiên chạy lệnh dưới đây:

```sh
php artisan make:controller ImageController
```

Sau lệnh này, bạn có thể tìm thấy file ImageController.php trong thư mục `app/Http/Controllers` của bạn. Mở file ImageController.php và thêm code dưới đây vào file đó.

* app/Http/Controllers/ImageController.php

```php
<?php
  
namespace App\Http\Controllers;
   
use Illuminate\Http\Request;
use App\Http\Requests;
use Image;
class ImageController extends Controller
{
  
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function resizeImage()
    {
        return view('resizeImage');
    }
  
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function resizeImagePost(Request $request)
    {
        $this->validate($request, [
            'title' => 'required',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
  
        $image = $request->file('image');
        $input['imagename'] = time().'.'.$image->getClientOriginalExtension();
     
        $destinationPath = public_path('/thumbnail');
        $img = Image::make($image->getRealPath());
        $img->resize(100, 100, function ($constraint) {
            $constraint->aspectRatio();
        })->save($destinationPath.'/'.$input['imagename']);
   
        $destinationPath = public_path('/images');
        $image->move($destinationPath, $input['imagename']);
   
        $this->postImage->add($input);
   
        return back()
            ->with('success','Image Upload successful')
            ->with('imageName',$input['imagename']);
    }
   
}
```

## Bước 5: Viết giao diện

Ok, trong bước cuối cùng này, mình sẽ tạo file resizeImage.blade.php cho hình thức tải lên ảnh và quản lý thông báo lỗi và thông báo thành công. Vì vậy, trước tiên hãy tạo file resizeImage.blade.php và thêm code dưới đây:

* resources/views/resizeImage.blade.php

```php
@extends('layouts.app')
   
@section('content')
<div class="container">
<h1>Resize Image Uploading Demo</h1>
@if (count($errors) > 0)
    <div class="alert alert-danger">
        <strong>Whoops!</strong> There were some problems with your input.<br><br>
        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif
   
@if ($message = Session::get('success'))
<div class="alert alert-success alert-block">
    <button type="button" class="close" data-dismiss="alert">×</button>    
    <strong>{{ $message }}</strong>
</div>
<div class="row">
    <div class="col-md-4">
        <strong>Original Image:</strong>
        <br/>
        <img src="/images/{{ Session::get('imageName') }}" />
    </div>
    <div class="col-md-4">
        <strong>Thumbnail Image:</strong>
        <br/>
        <img src="/thumbnail/{{ Session::get('imageName') }}" />
    </div>
</div>
@endif
   
{!! Form::open(array('route' => 'resizeImagePost','enctype' => 'multipart/form-data')) !!}
    <div class="row">
        <div class="col-md-4">
            <br/>
            {!! Form::text('title', null,array('class' => 'form-control','placeholder'=>'Add Title')) !!}
        </div>
        <div class="col-md-12">
            <br/>
            {!! Form::file('image', array('class' => 'image')) !!}
        </div>
        <div class="col-md-12">
            <br/>
            <button type="submit" class="btn btn-success">Upload Image</button>
        </div>
    </div>
{!! Form::close() !!}
</div>
@endsection
```

# Kết luận

Ok, cuối cùng tạo hai thư mục trong thư mục `public` của bạn là `images` (1) và `thumbnail` (2) và cấp quyền cho thư mục đó và check ...

Mình hy vọng bài viết này có thể giúp bạn áp dụng được vào dự án của mình!

Xin chân thành cám ơn!

# Nguồn
https://itsolutionstuff.com/post/laravel-compress-image-before-upload-exampleexample.html
