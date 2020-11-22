# logout
This file describes the `/logout` endpoint.

## Core details
* Endpoint: `/logout`.
* Request method: `POST`.
* Body parameters:
    * `token`: string of 60 characters.
* Response parameters:
    * `message`

## Example operations
### Example (valid input)
```js
let res = await axios({
    method: 'post',
    url: 'https://tar-heel-calendar.herokuapp.com/logout',
    data: {
        token: 'b15efc04cb19d956fc982451343981ecf956dc31eab7486a4d7939a77476'
    }
});
```

#### Response (status: 200)
```json
{
    "message": "Deleted token."
}
```

### Example (token not found)
```js
let res = await axios({
    method: 'post',
    url: 'https://tar-heel-calendar.herokuapp.com/logout',
    data: {
        token: 'ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ'
    }
});
```

#### Response (status: 400)
```json
{
    "message": "Token not found."
}
```

### Example (bad length)
```js
let res = await axios({
    method: 'post',
    url: 'https://tar-heel-calendar.herokuapp.com/logout',
    data: {
        token: 'b15efc04cb19d956fc982451343'
    }
});
```

#### Response (status: 400)
```json
{
    "message": "Invalid length of parameter."
}
```