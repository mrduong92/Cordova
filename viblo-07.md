# Làm thế nào để cài đặt Botman Chatbot trong Laravel?

## Giới thiệu

Trong hướng dẫn này, tôi muốn chỉ cho bạn cách tạo chatbot đơn giản bằng botman trong ứng dụng laravel 5.8 hiện có của bạn. chúng tôi sẽ cài đặt botman với laravel và bạn có thể dễ dàng sử dụng trình điều khiển web, trình điều khiển facebook, trình điều khiển telegram, trình điều khiển chậm, trình điều khiển trò chuyện, v.v. chúng tôi sẽ sử dụng trình điều khiển web để tạo chatbot botman rất đơn giản trong ứng dụng laravel 5.

Chatbots là một phổ biến trong công nghệ ngày nay. mọi người đều muốn đưa chatbot vào trang web của mình vì chúng tôi có thể dễ dàng tích hợp câu hỏi faq và người dùng có thể đặt câu hỏi đơn giản liên quan đến trang web của chúng tôi.

Có một số bot có sẵn trên thị trường. một số công ty có bot riêng. nhưng hầu như được trả tiền vì vậy tôi sẽ thích sử dụng botman là chatbot mã nguồn mở với laravel. bạn cũng có thể dễ dàng tích hợp với laravel.

Dưới đây tôi đã liệt kê một số bước để tạo ví dụ rất đơn giản để xây dựng chatbot với ứng dụng laravel hiện có của bạn. vì vậy, hãy làm theo vài bước để có được chatbot botman với ứng dụng của bạn.

![](https://itsolutionstuff.com/upload/laravel-botman-chatbots.png)

## Step 1: Cài đặt Laravel 5.8

Trước hết chúng ta cần có ứng dụng phiên bản Laravel 5.8 mới bằng cách sử dụng lệnh bellow, vì vậy hãy mở dấu nhắc lệnh OR của thiết bị đầu cuối và chạy lệnh dưới đây:

```sh
composer create-project --prefer-dist laravel/laravel blog
```

## Step 2: Cài đặt Botman và Botman Driver

Trong bước này, chúng tôi sẽ cài đặt gói trình soạn thảo botman và cũng cài đặt trình điều khiển web botman. Vì vậy, chúng ta cần chạy theo cả hai lệnh để cài đặt botman.

* Cài đặt Botman:

```sh
composer require botman/botman
```

* Cài đặt Botman Driver:

```sh
composer require botman/driver-web
```

## Step 3: Tạo file config

Bước này không bắt buộc phải tuân theo. Nhưng bạn có thể tạo tập tin cấu hình cho trình điều khiển và bộ đệm. Vì vậy, hãy tạo tập tin bot trên thư mục cấu hình và viết mã như tôi đã đưa ra dưới đây:

* config/botman/config.php

```php
<?php
  
return [
   
    'conversation_cache_time' => 40,
  
    'user_cache_time' => 30,
];
```

* config/botman/web.php

```php
<?php
  
return [
   
    'matchingData' => [
        'driver' => 'web',
    ],
];
```

## Step 4: Tạo Routes

Ở đây, chúng ta cần thêm các tuyến tạo cho yêu cầu botman. vì vậy hãy mở file `routes/web.php` của bạn và thêm route sau.

* routes/web.php

```php
Route::get('/', function () {
    return view('welcome');
});
    
Route::match(['get', 'post'], '/botman', 'BotManController@handle');
```

# Step 5: Tạo Controller

Trong bước này, chúng ta cần tạo một bộ điều khiển là BotManController. Trong controller này, chúng ta cần viết mã trả lời và hội thoại của botman. bạn cũng có thể viết logic của riêng bạn sau này.

* app/Http/Controllers/BotManController.php

```php
<?php
  
namespace App\Http\Controllers;
  
use BotMan\BotMan\BotMan;
use Illuminate\Http\Request;
use BotMan\BotMan\Messages\Incoming\Answer;
  
class BotManController extends Controller
{
    /**
     * Place your BotMan logic here.
     */
    public function handle()
    {
        $botman = app('botman');
  
        $botman->hears('{message}', function($botman, $message) {
  
            if ($message == 'hi') {
                $this->askName($botman);
            }else{
                $botman->reply("write 'hi' for testing...");
            }
  
        });
  
        $botman->listen();
    }
  
    /**
     * Place your BotMan logic here.
     */
    public function askName($botman)
    {
        $botman->ask('Hello! What is your Name?', function(Answer $answer) {
  
            $name = $answer->getText();
  
            $this->say('Nice to meet you '.$name);
        });
    }
}
```

# Step 6: Update Blade File

Trong tệp này, chúng tôi cần cập nhật một số mã trên tệp chào mừng balde. chúng ta cần thêm widget botman trong tệp welcome.blade.php.

* resources/views/welcome.blade.php

```html
<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>How to install Botman Chatbot in Laravel 5? - ItSolutionStuff.com</title>
        <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">
        <style>
            html, body {
                background-color: #fff;
                color: #636b6f;
                font-family: 'Nunito', sans-serif;
                font-weight: 200;
                height: 100vh;
                margin: 0;
            }
        </style>
    </head>
    <body>
    </body>
  
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/botman-web-widget@0/build/assets/css/chat.min.css">
    <script>
	    var botmanWidget = {
	        aboutText: 'ssdsd',
	        introMessage: "✋ Hi! I'm form ItSolutionStuff.com"
	    };
    </script>
  
    <script src='https://cdn.jsdelivr.net/npm/botman-web-widget@0/build/js/widget.js'></script>
      
</html>
```

Bây giờ chúng tôi đã sẵn sàng để chạy ví dụ chatbot của chúng tôi với laravel 5.8, vì vậy hãy chạy lệnh dưới đây để chạy nhanh:

```sh
php artisan serve
```

Bây giờ bạn có thể mở URL dưới đây trên trình duyệt của mình:
```sh
http://localhost:8000
```

Chúng tôi cũng có thể sử dụng một số hướng dẫn từ đây: https://botman.io/2.0/welcome.

Bạn có thể download từ git: https://github.com/savanihd/laravel-chatbot-botman

Tôi hy vọng bài viết này có thể giúp bạn áp dụng được vào dự án của mình. Xin cám ơn v
