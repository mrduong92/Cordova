# Gọi Eloquent từ Blade: 6 lời khuyên cho hiệu suất

## Giới thiệu
Một trong những vấn đề hiệu suất phổ biến nhất mà tôi đã thấy trong Laravel là sử dụng các phương thức và mối quan hệ Eloquent từ Blade, tạo ra các vòng lặp và truy vấn bổ sung không cần thiết. Trong bài viết này, tôi sẽ chỉ ra các kịch bản khác nhau và cách xử lý chúng hiệu quả.

## Kịch bản 1. Load belongsTo() Relationship: Đừng quên EagerLoading

Có lẽ, trường hợp điển hình nhất - bạn lặp lại với @foreach thông qua các bản ghi và trong một số cột bạn cần hiển thị bản ghi gốc của nó với một số trường.

```php
@foreach ($sessions as $session)
<tr>
  <td>{{ $session->created_at }}</td>
  <td>{{ $session->user->name }}</td>
</tr>
@endforeach
```
Và, tất nhiên, session thuộc về user, trong `app/Session.php`:

```php
public function user()
{
    return $this->belongsTo(User::class);
}
```

Bây giờ, code có thể trông vô hại và chạy chính xác, nhưng tùy thuộc vào code ở controller, chúng ta có thể có một vấn đề hiệu năng rất lớn ở đây.

Code sai trong Controller:

```php
public function index()
{
    $sessions = Session::all();
    return view('sessions.index', compact('sessions');
}
```

Code đúng:

```php
public function index()
{
    $sessions = Session::with('user')->get();
    return view('sessions.index', compact('sessions');
}
```

Bạn có thấy sự khác biệt? Chúng tôi đang load mối quan hệ với truy vấn Eloquent chính, nó được gọi là Eager Loading (https://laravel.com/docs/5.8/eloquent-relationships#eager-loading).

Nếu chúng ta không làm điều đó, trong vòng lặp foreach Blade của chúng ta sẽ gọi một truy vấn SQL cho mỗi session, request người dùng trực tiếp từ database mỗi lần. Vì vậy, nếu bạn có một bảng có 100 session, thì bạn sẽ có 101 truy vấn - 1 cho danh sách session và 100 lần khác cho các user liên quan.

Vì vậy, đừng quên EagerLoading.

## Kịch bản 2. Load hasMany() Relationship

Một kịch bản điển hình khác là bạn cần liệt kê tất cả các mục con trong vòng lặp của các bản ghi cha.

```php
@foreach ($posts as $post)
<tr>
  <td>{{ $post->title }}</td>
  <td>
    @foreach ($post->tags as $tag)
      <span class="tag">{{ $tag->name }}</span>
    @endforeach
  </td>
</tr>
@endforeach
```
Đoán xem - điều tương tự áp dụng ở đây. Nếu bạn không sử dụng EagerLoading, thì mỗi bài đăng sẽ có một request đến database.

Vì vậy, trong controller của bạn, bạn nên làm như thế này:
```php
public function index()
{
    $posts = Post::with('tags')->get(); // not just Post::all()!
    return view('posts.index', compact('posts'));
}
```

## Kịch bản 3. KHÔNG sử dụng Brackets trong hasMany() relationship

Hãy để tưởng tượng bạn có một cuộc thăm dò với số phiếu và muốn hiển thị tất cả các cuộc thăm dò với số phiếu họ có.

Tất nhiên, bạn đang thực hiện Tải háo hức trong Controller:

```php
public function index()
{
    $polls = Poll::with('votes')->get();
    return view('polls', compact('polls'));
}
```
Và sau đó trong file Blade, nó hiển thị như thế này:

```php
@foreach ($polls as $poll)
    <b>{{ $poll->question }}</b> 
    ({{ $poll->votes()->count() }})
    <br />
@endforeach
```
Có vẻ ổn, phải không? Nhưng thông báo `->vote ()`, với dấu ngoặc. Nếu bạn để nó như thế này, thì VẪN sẽ có một truy vấn cho mỗi cuộc thăm dò. Bởi vì nó không nhận được dữ liệu mối quan hệ được tải, thay vào đó, nó gọi phương thức của nó từ Eloquent một lần nữa.

Vì vậy, vui lòng thực hiện việc này: {{ $poll->vote->count() }}. Không có dấu ngoặc.

Và qua đó, cùng áp dụng cho `belongsTo` relationship. Đừng sử dụng dấu ngoặc trong khi load các mối quan hệ trong Blade.

Offtopic: trong khi duyệt StackOverflow, tôi đã thấy các ví dụ thực sự thậm chí còn tồi tệ hơn về điều này. Giống như: {{ $poll->vote()->get()->count() }} hoặc @foreach ( $poll->vote()->get() as $vote). Hãy thử điều đó với Laravel Debugbar (https://github.com/barryvdh/laravel-debugbar) và xem số lượng truy vấn SQL.

## Kịch bản 4. Điều gì xảy ra Relationship có thể rỗng?

Một trong những lỗi phổ biến nhất trong Laravel là "trying to get property of non-object", bạn đã thấy nó trước đây trong các dự án của mình chưa? (thôi nào, lừa đảo, nói dối).
Thông thường nó đến từ một cái gì đó như thế này:

```html
<td>{{ $payment->user->name }}</td>
```

Không có gì đảm bảo rằng người dùng cho khoản thanh toán đó vẫn tồn tại. Có lẽ nó đã bị xóa mềm? Có thể thiếu khóa ngoại khóa trong database, cho phép ai đó xóa người dùng vĩnh viễn?

Bây giờ, giải pháp phụ thuộc vào phiên bản Laravel / PHP. Trước Laravel 5.7, cú pháp điển hình hiển thị giá trị mặc định là:

```html
{{ $payment->user->name or 'Anonymous' }}
```

Kể từ Laravel 5.7, nó đã thay đổi cú pháp để theo toán tử PHP phổ biến, được giới thiệu trong PHP 7:

```html
{{ $payment->user->name ?? 'Anonymous' }}
```
Nhưng bạn có biết bạn cũng có thể gán giá trị mặc định ở cấp độ Eloquent không?

```php
public function user()
{
    return $this->belongsTo(User::class)->withDefault();
}
```
Phương thức `withDefault()` này sẽ trả về model rỗng của class `User`, nếu mối quan hệ không tồn tại.
Không chỉ vậy, bạn cũng có thể set cho model đó các giá trị mặc định!

```php
public function user()
{
    return $this->belongsTo(User::class)
      ->withDefault(['name' => 'Anonymous']);
}
```

## Kịch bản 5. Tránh các câu lệnh trong Blade với Extra Relationships

Bạn đã thấy code như thế này trong Blade chưa?

```php
@foreach ($posts as $post)
    @foreach ($post->comments->where('approved', 1) as $comment)
        {{ $comment->comment_text }}
    @endforeach
@endforeach
```

Vì vậy, bạn có thể lọc các comments (đã dùng eager loading, tất nhiên, phải không?) Với một điều kiện khác trong đó `('approved', 1)`.
Nó hoạt động và nó không gây ra bất kỳ vấn đề nào về hiệu năng. Nhưng sở thích cá nhân của tôi (và cả nguyên tắc MVC) thì xử lý logic không nên nằm ngoài View, nên đặt ở chỗ khác tốt hơn, đó là lớp logic. Đó có thể là model Eloquent, nơi bạn có thể chỉ định mối quan hệ riêng cho các comment được phê duyệt trong `app/Post.php`.

```php
public function comments()
{
    return $this->hasMany(Comment::class);
}

public function approved_comments()
{
    return $this->hasMany(Comment::class)->where('approved', 1);
}
```

Và sau đó bạn load mối quan hệ cụ thể đó trong `Controller/Blade`:

```php
$posts = Post::with(‘approved_comments’)->get();
```

## Kịch bản 6. Tránh các điều kiện rất phức tạp với người truy cập
Gần đây trong một dự án tôi đã có một nhiệm vụ: liệt kê các công việc, với biểu tượng phong bì cho các tin nhắn và với giá cho công việc nên được lấy từ tin nhắn LAST có chứa giá đó. Nghe có vẻ phức tạp, và nó là. Nhưng này, đời thực cũng khá phức tạp!

Trong mã đầu tiên tôi đã viết một cái gì đó như thế này:
```php
@foreach ($jobs as $job)
    ...
    @if ($job->messages->where('price is not null')->count())
        {{ $job->messages->where('price is not null')->sortByDesc('id')->first()->price }}
    @endif
@endforeach
```
Ôi, kinh hoàng. Tất nhiên, bạn cần kiểm tra xem giá có tồn tại hay không, sau đó lấy tin nhắn cuối cùng với giá đó, nhưng vít Vít, nó không nên có trong Blade.
Vì vậy, tôi đã kết thúc bằng cách sử dụng phương thức Accessor trên Eloquent và định nghĩa điều này trong app / Job.php:

```php
public function getPriceAttribute()
{
    $price = $this->messages
        ->where('price is not null')
        ->sortByDesc('id')
        ->first();
    if (!$price) return 0;

    return $price->price;
}
```
Tất nhiên, với những tình huống phức tạp như vậy, nó cũng dễ dàng nhảy vào vấn đề truy vấn N + 1 hoặc chỉ là khởi động các truy vấn nhiều lần một cách tình cờ. Vì vậy, vui lòng sử dụng Laravel Debugbar để tìm lỗ hổng.
Ngoài ra, tôi có thể đề xuất một gói có tên là Laravel N + 1 Truy vấn truy vấn.

Bonus. Tôi muốn để lại cho bạn ví dụ tồi tệ nhất về mã mà tôi đã thấy trên Laracasts, trong khi nghiên cứu chủ đề này. Ai đó muốn lời khuyên cho mã này dưới đây.
Thật không may, mã như thế này được nhìn thấy trong các dự án trực tiếp quá thường xuyên. Bởi vì, tốt, nó hoạt động được (don cộng thử cái này ở nhà).

```html
@foreach($user->payments()->get() as $payment)
<tr>
    <td>{{$payment->type}}</td>
    <td>{{$payment->amount}}$</td>
    <td>{{$payment->created_at}}</td>
    <td>
        @if($payment->method()->first()->type == 'PayPal')
            <div><strong>Paypal: </strong> 
            {{ $payment->method()->first()->paypal_email }}</div>
        @else
            <div><strong>Card: </strong>
            {{ $payment->payment_method()->first()->card_brand }} **** **** **** 
            {{ $payment->payment_method()->first()->card_last_four }}</div>
        @endif
    </td>
</tr>
@foreach
```
