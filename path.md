1. User `/user`

-   GET `/me`
-   GET `/order`
-   GET `/order/:id`
-   GET `/review`
-   GET `/review/:productId`
-   GET `/:id`
-   GET `/` (Admin)

-   POST `/login`
-   POST `/register`
-   POST `/request-password-reset` X
-   POST `reset-password` X

-   PATCH `/me`

-   DELETE `/:id` (Admin)

2. Product `/product`

-   GET `/autocomplete`
-   GET `/search`
-   GET `/product/:id/review`
-   GET `/:id`
-   GET `/`

-   POST `/:id/review`
-   POST `/` (Admin)
-   PUT `/:id` (Admin)
-   PATCH `/:id` (Admin)
-   DELETE `/:id` (Admin)

3. Review

-   GET `/` (Admin)

4. Cart `/cart`

-   GET `/all` (Admin)
-   GET `/:userId` (Admin)
-   GET `/`
-   POST `/checkout`
-   PATCH `/`

5. Order `/order`

-   GET `/` (Admin)
-   GET `/:id` (Admin)
-   PATCH `/:id` (Admin)
