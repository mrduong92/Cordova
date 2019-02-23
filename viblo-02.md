# Laravel 5.7 Module Structure Application Example

## Giới thiệu

Trong hướng dẫn này, mình muốn giới thiệu tới các bạn cách tạo hệ thống module cho ứng dụng Laravel 5.7.

Mình sẽ gợi ý cho các bạn code với design pattern theo cấu trúc module bằng cách sử dụng package nWidart/laravel-modules.

Bạn có thể nhanh chóng tạo module bằng cách sử dụng lệnh thiết lập bằng package laravel-module. Vì vậy về cơ bản nó sẽ tạo thư mục riêng cho mỗi module.

Khi mình bắt đầu làm việc với laravel và mình thấy cấu trúc của laravel 5.7 như bộ điều khiển, khung nhìn, mô hình, di chuyển, bàn điều khiển, nhà cung cấp và người trợ giúp, v.v. mình rất ấn tượng và mình thích nhiều hơn. Nhưng mình vẫn hơi bối rối, nghĩ rằng chúng ta có thể biến nó thành module sau đó nó trở nên hữu ích và dễ hiểu hơn. Nếu các bạn tạo module cho mỗi thao tác CRUD như country, state, city, item, product...

Thật tuyệt vời vì nó có thể tái sử dụng trong ứng dụng laravel khác của các bạn một cách dễ dàng. Phương pháp cấu trúc module là tốt bởi vì nó hữu ích hơn cho chúng ta.

Trong bài đăng này, chúng mình sẽ tạo cấu trúc module bằng cách sử dụng package trình soạn thảo module laravel. Có một số package khác để tạo module trong ứng dụng laravel. package laravel-module tạo thư mục "module" và module thư mục con khôn ngoan.

Nó rất đơn giản và dễ hiểu.

Có những thứ được liệt kê trên thư mục đó:

**1) Config**

**2) Console**

**3) Database**

**4) Entites**

**5) Http**

**6) Providers**

**7) Routes**

**8) Tests**

Trước tiên mình sẽ cài đặt laravel-modules composer package & service provider. 

Chạy lệnh dưới đây để cài đặt laravel-module.

![](https://itsolutionstuff.com/upload/laravel-5-7-modular-system.png)

## Cài đặt

### Cài laravel-modules Package:

```sh
composer require nwidart/laravel-modules

```

### Publish config file:

```sh
php artisan vendor:publish --provider="Nwidart\Modules\LaravelModulesServiceProvider"

```

### Autoload file composer.json

```json
{

  "autoload": {

    "psr-4": {

      "App\\": "app/",

      "Modules\\": "Modules/"

    }

  }

}
```

Sau đó chạy lệnh sau:

```sh
composer dump-autoload

```

Ok, bây giờ chúng ta đã sẵn sàng để tạo module bằng cách sử dụng command của package laravel-module, vì vậy bạn chỉ cần tạo package mới như cú pháp dưới đây:

```sh
php artisan make:module module_name
```

### Ví dụ để tạo module:

```sh
php artisan make:module Category
```

Sau khi chạy lệnh trên, bạn có thể thấy thư mục Modules với cấu trúc mới trong ứng dụng. Cấu trúc trông như dưới đây:

```sh
app/

bootstrap/

vendor/

Modules/

  ├── Category/

      ├── Assets/

      ├── Config/

      ├── Console/

      ├── Database/

          ├── Migrations/

          ├── Seeders/

      ├── Entities/

      ├── Http/

          ├── Controllers/

          ├── Middleware/

          ├── Requests/

      ├── Providers/

          ├── CategoryServiceProvider.php

          ├── RouteServiceProvider.php

      ├── Resources/

          ├── assets/

              ├── js/

                ├── app.js

              ├── sass/

                ├── app.scss

          ├── lang/

          ├── views/

      ├── Routes/

          ├── api.php

          ├── web.php

      ├── Repositories/

      ├── Tests/

      ├── composer.json

      ├── module.json

      ├── package.json

      ├── webpack.mix.js
```

Như bạn có thể thấy cấu trúc thư mục của bạn có: controllers, models, views, database, repository, routes and helper. Vì vậy, bạn có thể chỉ cần tạo thêm m khi bạn cần thiết. Bạn chỉ có thể chạy bằng lệnh sau:

```sh
php artisan serve

```

Mở trong trình duyệt của bạn: `http://localhost:8000/category`

Bạn có thể đọc thêm thông tin tại đây.

Mình hy vọng bài viết này có thể giúp bạn điều gì đó cho việc cấu trúc lại module cho ứng dụng của mình.

# Tham khảo
https://itsolutionstuff.com/post/laravel-57-modular-structure-application-example-example.html
https://nwidart.com/laravel-modules/v4/introduction
