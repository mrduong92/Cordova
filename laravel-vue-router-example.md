Bạn đang tìm kiếm ứng dụng tạo một trang bằng cách sử dụng vue js trong laraval thì bạn biết cách tạo bộ định tuyến trong vue. Nếu bạn biết về gói npm thì bạn cần cài đặt vue-router để tạo bộ định tuyến trong vue.

Trong ví dụ này, tôi sẽ hiển thị để tạo bộ định tuyến vue giống như tuyến đường laravel mà chúng ta đang tạo. Chúng ta phải tạo bộ định tuyến vue với mẫu thành phần hoặc html. bây giờ chúng tôi sẽ tạo tuyến trang chủ và tuyến trang người dùng cho ví dụ cơ bản, để bạn có thể hiểu cách chúng tôi có thể thêm nhiều bộ định tuyến hơn trong ứng dụng vue laravel.

Bạn chỉ cần làm theo từng bước hướng dẫn này và bạn sẽ có được ví dụ rất hay và rất dễ dàng. Bạn cũng có thể tải xuống và xem bản demo dưới dạng liên kết dưới đây.

# Bước 1 : Config NPM
Trong bước này, trước tiên chúng ta phải thêm thiết lập của vue js và sau đó cài đặt npm, vì vậy hãy chạy lệnh dưới đây trong dự án của bạn.

Install vue:

```sh
php artisan preset vue
```

Install npm:
```sh
npm install
```
Install npm vue vue-router:
```sh
npm install vue-router
```

# Bước 2: Viết app.js và Components
Ở đây, chúng tôi sẽ viết mã trên app.js và sau đó chúng tôi sẽ tạo các thành phần vue js, vì vậy hãy tạo cả hai tệp và đặt mã dưới đây:

`resources/assets/js/app.js`

```js
require('./bootstrap');
   
window.Vue = require('vue');
import VueRouter from 'vue-router'
  
Vue.use(VueRouter)
   
const routes = [
  { path: '/', component: require('./components/ExampleComponent.vue') },
  { path: '/user', component: require('./components/User.vue') }
]
  
const router = new VueRouter({
  routes 
})
  
const app = new Vue({
  router
}).$mount('#app')
```

`resources/assets/js/components/ExampleComponent.vue`
```js
<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Home Component</div>
  
                    <div class="card-body">
                        Welcome to Homepage
                        <br/>
                        <router-link to="/user">Go to User</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
   
<script>
    export default {
        mounted() {
            console.log('Component mounted.')
        }
    }
</script>
```

`resources/assets/js/components/User.vue`
```js
<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">User Component</div>
  
                    <div class="card-body">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                        cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        <br/>
                        <router-link to="/">Go to Home</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
    export default {
        mounted() {
            console.log('Component mounted.')
        }
    }
</script>
```

# Bước 3:  Update welcome.blade.php
Ở bước cuối cùng, chúng tôi sẽ cập nhật tệp welcome.blade.php của chúng tôi. trong tệp này, chúng tôi sẽ sử dụng tệp app.js và sử dụng tệp đó, vì vậy hãy cập nhật.

`resources/views/welcome.blade.php`

```js
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Laravel Vue Router Message Example From Scratch - ItSolutionStuff.com</title>
        <link href="{{asset('css/app.css')}}" rel="stylesheet" type="text/css">
    </head>
    <body>
        <h1>Laravel Vue Router Example From Scratch - ItSolutionStuff.com</h1>
        <div id="app">
            <router-view></router-view>
        </div>
        <script src="{{asset('js/app.js')}}" ></script>
    </body>
</html>
```

Bây giờ bạn phải chạy `npm run dev` để cập nhật file app.js.

Bây giờ bạn có thể kiểm tra ví dụ của chúng tôi. Tôi hy vọng nó có thể giúp bạn...
