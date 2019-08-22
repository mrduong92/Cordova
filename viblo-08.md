# 6 lời khuyên về Data Seeding trong Laravel

## Giới thiệu
Laravel migration có một chức năng tuyệt vời của seeding data. Trong bài viết này, tôi sẽ chỉ ra các mẹo từ kinh nghiệm của bản thân, cách sử dụng seeding trong các trường hợp thực tế.

## Tip 1. Sử dụng updateOrCreate () để tránh nhân đôi

Hãy tưởng tượng seeder code này và tưởng tượng nếu vì lý do nào đó, seeder này sẽ được chạy nhiều lần:

```php
public function run()
{
    $items = [            
        ['id' => 1, 'name' => 'Ti'],
        ['id' => 2, 'name' => 'Teo'],
    ];

    foreach ($items as $item) {
        User::create($item);
    }
}
```

Lần chạy thứ hai có thể sẽ thất bại vì xung đột ID. Trong trường hợp khác, nếu bạn không chỉ định ID, thì bạn có thể kết thúc với quá nhiều dữ liệu trong bảng, với các item bị lặp lại. Để tránh điều đó, hãy làm điều này:

```php
foreach ($items as $item) {
    Role::updateOrCreate(['id' => $item['id']], $item);
}
```

Tham khảo thêm: https://laraveldaily.com/use-updateorcreate-to-run-seeds-at-any-time/

## Tip 2. Chỉ chạy 1 class Seeder

Cách đây một thời gian, tôi khá ngạc nhiên khi có nhiều người không biết rằng có thể chỉ định một class seeder khi chạy command:
```sh
php artisan db: seed
```

Lệnh này sẽ khởi chạy mọi thứ được liệt kê trong file DatabaseSeeder.php.

Nhưng bạn có thể giới hạn khởi chạy với một seeder cụ thể:

```php
php artisan db:seed --class=UsersTableSeeder
```

## Tip 3. Chạy class Seeder từ migration
Một điều có thể xảy ra rất thường xuyên, bạn cần tạo một bảng mới trong database và ngay lập tức seed với một số data.
Nhưng trong môi trường production, bạn có thể chỉ cần chạy `php artisan db:seed`, đặc biệt nếu bạn có cài đặt deploy tự động thì bạn chỉ cần chạy `php artisan migrate`.

Bí quyết là khởi chạy một seeder cụ thể từ chính file migration.

```php
public function up()
{
    Schema::create('posts', function (Blueprint $table) {
        $table->increments('id');
        $table->text('title');
    });

    Artisan::call('db:seed', [
        '--class' => PostsTableSeeder::class
    ]);
}
```

## Tip 4. Seeder Factory với Relationship: Sử dụng Parent’s Factory

Nếu bạn sử dụng Factories cho seeds của mình, làm thế nào để bạn thiết lập mối quan hệ giữa 2 model?

Ví dụ, bạn cần chọn 10 categories (chuyên mục) và 10 posts (bài viết) trong các category đó?

Ở đây, file `database/factories/PostFactory.php` như sau:

```php
$factory->define(App\Post::class, function (Faker\Generator $faker) {
    return [
        'category_id' => factory('App\Post')->create()->id,
        'title' => $faker->sentence(),
        'content' => $faker->paragraph(),
    ];
});
```

Xem trường category_id được fill như thế nào với một factory khác?

Ngoài ra còn có một cách khác, có lẽ ít phổ biến hơn - bạn có thể đọc về nó trong một bài viết khác.
https://laraveldaily.com/laravel-two-ways-seed-data-relationships/

## Tip 5. DatabaseSeeder cho Local và Production

Đôi khi bạn cần phải seed một số dữ liệu chỉ trong môi trường local của bạn, nhưng không phải trong production. Hoặc sử dụng các file seeder khác nhau cho các môi trường khác nhau.

Tôi không chắc đó có phải là cách hay nhất hay không, nhưng cái mà tôi đã đạt được là cách seed khác nhau cho môi trường local và production.

```php
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        if (app()->environment() == 'production') {
            $this->call(PostsTableSeeder::class);
            $this->call(CategoriesTableSeeder::class);
        } else {
            $this->call(UsersTableSeeder::class);
            $this->call(MenusTableSeeder::class);
            $this->call(PostsTableSeeder::class);
            $this->call(CategoriesTableSeeder::class);
        }
    }
}
```

## Tip 6. Sử dụng iSeed để tạo Seeders từ Database

Tip cuối cùng thực sự là một công cụ mà tôi đã sử dụng cho mình khá nhiều lần, nó được gọi là iSeed Generator.

Cái này tôi sẽ dành thời gian và giới thiệu riêng đến các bạn trong 1 bài viết khác ở lần sau. Giờ các bạn thử tự tìm hiểu về nó trước đi nhé :).

Link: https://github.com/orangehill/iseed

Bạn có thể tham khảo thêm video về package này tại đây: https://youtu.be/Qf1cs7MbHHs

# Kết luận

Đó là nó. Lời khuyên cuối cùng là bạn nên chạy seeder trước trên môi trường `local/staging`.
Bạn có thể chạy `php artisan migrate:fresh –seed` một cách an toàn nhiều lần mà không mất bất kỳ dữ liệu quan trọng nào.
Nhưng trên môi trường production bạn chỉ cần chạy `php artisan db:seed` chỉ một lần.
Nếu bạn cần chạy một số seed trong production, hãy đưa nó vào migration, xem Tip 3.

Cám ơn các bạn đã đọc bài viết của tôi. Hy vọng bài viết này sẽ giúp các bạn có thể áp dụng được vào dự án của mình!

# Nguồn
https://laraveldaily.com/10-tips-about-data-seeding-in-laravel/
