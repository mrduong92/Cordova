# Đa ngôn ngữ VueJS trong Laravel
Đa ngôn ngữ là tính năng quan trọng đối với mỗi website và luôn được các developer quan tâm khi sử dụng các framework. Đối với Laravel Framework, chúng ta sẽ sử dụng [Localization](https://laravel.com/docs/5.4/localization). 
Laravel cung cấp cho chúng ta một cách đơn giản để ứng dụng đa ngôn ngữ. Các file language được đặt tại folder `resources/lang`. Khi chúng ta sử dụng đa ngôn ngữ với Blade Template của Laravel thì cơ chế này rất dễ dàng,  bạn có thể sử dụng cú pháp `{{}}` hoặc sử dụng chỉ thị `@lang`:
```
{{ __('messages.welcome') }}
@lang('messages.welcome')
```
Trong Blade Template để sử dụng Localization đơn giản là vậy, nhưng trong dự án Laravel sử dụng VueJS thì sao? Chúng ta sẽ làm thế nào để sử dụng Localization của Laravel trong file .vue? Chẳng lẽ chúng ta lại đi truyền dữ liệu Localization từ Blade gán sang biến JS để sử dụng trong VueJS theo kiểu:
```
<script>
var welcome = "{{ __('messages.welcome') }}";
</script>
```
Sau đó sử dụng biến welcome này trong VueJS???
Nhưng giả sử trong trường hợp có hàng trăm, hàng nghìn từ cần dịch thì chúng ta cũng sẽ truyền hàng trăm, hàng nghìn biến từ Blade sang JS? Câu trả lời là KHÔNG.

Hôm nay, mình xin giới thiệu package rất tuyệt vời để giải quyết vấn đề trên. Đó là **[laravel-vue-i18n-generator](https://github.com/martinlindhe/laravel-vue-i18n-generator)**.
Package này cho phép bạn chia sẻ đa ngôn ngữ trong Laravel cho giao diện Vue, sử dụng [Vue-i18n](https://github.com/kazupon/vue-i18n). 
Cơ chế của nó là tạo một file tương thích với vue-i18n được clone từ file localization trong Laravel của bạn. Nó sẽ đọc nội dung các file language tại folder `resources/lang` và generate ra file có tên `vue-i18n-locales.generated.js` tại thư mục: `/apps/resources/assets/js/`. File được tạo ra này bản chất là 1 `ES6 module` để Vue-i18n có thể hiểu được. Nó sẽ là cơ sở để hiển thị đa ngôn ngữ từ Laravel ra giao diện Vue.
# Cài đặt
* Trong project của bạn chạy lệnh composer:
```
composer require martinlindhe/laravel-vue-i18n-generator
```
* Trong `config/app.php` providers:
```
MartinLindhe\VueInternationalizationGenerator\GeneratorProvider::class,
```
* Tiếp theo, ta publish default config của package:
```
php artisan vendor:publish --provider="MartinLindhe\VueInternationalizationGenerator\GeneratorProvider"
```
* Sau đó, chúng ta tạo file i18n cho Vue:
```
php artisan vue-i18n:generate
```
* Cài đặt Vue I18n để sử dụng đa ngôn ngữ trong Vue:
```
npm install vue-i18n
```
# Sử dụng
1. Đầu tiên, ta import các module cần thiết trong file `resources/assets/js/app.js`:
```js
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import messages from './vue-i18n-locales.generated.js';

Vue.use(VueI18n);
```
2. Tạo 1 instance của VueI18n với các options:
```
window.i18n = new VueI18n({
    locale: 'ja', // set locale là tiếng Nhật - biến này chúng ta có thể lấy động từ file config/app.php sang
    messages, // set locale messages
});
```
3. Tạo 1 instance của Vue với `i18n` option:
```
new Vue({ i18n }).$mount('#app');
```
Bây giờ hãy bắt đầu tận hưởng sức mạnh của nó!
# Kết quả
* Giả sử chúng ta có file `messages.php` trong folder `resources/lang/ja/messages.php` với nội dung:
```php
return [
    'hello' => "こんにちは、:name" //name là biến được truyền vào
];
```
* Chạy command `php artisan vue-i18n:generate` để generate ra file `vue-i18n-locales.generated.js`, nó sẽ có nội dung như sau:
```
export default {
    "ja": {
        "messages": {
        		"hello": "こんにちは、{name}"
   		}
    }
}
```
* Để hiển thị text hello ra, chúng ta code html như sau:
```html
<div id="#app">
  <p>{{ $t('messages.hello', {name: 'Dat'}) }}</p>
</div>
```
* Kết quả hiển thị ra màn hình:
こんにちは、Dat
# Kết luận
Như vậy, mình đã giới thiệu cho các bạn 1 package rất hay để sử dụng đa ngôn ngữ trong Laravel với VueJS. Mình cũng đã áp dụng nó vào dự án mình từng làm với Laravel sử dụng VueJS. Để tìm hiểu kỹ hơn về package này, bạn có thể truy cập vào link tham khảo mình đặt ở bên dưới. Hy vọng nó sẽ giúp ích cho các bạn trong các dự án thực tế. Chúc các bạn thành công!

# Tham khảo
https://github.com/martinlindhe/laravel-vue-i18n-generator
http://kazupon.github.io/vue-i18n/en/formatting.html
https://laravel.com/docs/5.4/localization
