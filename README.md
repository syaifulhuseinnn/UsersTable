# Background

Yesterday I got challanged from big transportation company in Indonesia for Frontend Developer position. The test were done on Algobash. The challange was complete all functionalities for an application contained Users Table. I felt stupid during technical test😖, because I failed. I have ever develop application like this but I got nervous and it made my brain freeze🥶. Because I felt annoyed I decided to develop the test again from the scratch.

# Requirements

1. Visitor can find a user in table by typing a keyword. Keyword can contain **First Name**, **Last Name**, or **Email**. User that match with the keyword will show automatically every visitor type the keyword.
2. Visitor can set the limit how much users want to show. Default limit is 5.
3. Visitor can sort the users by **ID** or **First Name** or **Last Name** or **Age** column. Also visitor can order by **Ascending** or **Descending**.

# Technologies

1. React
2. Chakra UI
3. useReducer
4. useEffect

# Development

### 1. Install Dependencies

We only have one third-party dependency. We only have **Chakra UI**. Run command below to install:

```bash
npm i @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

Read complete installation and setup on [https://chakra-ui.com/getting-started](https://chakra-ui.com/getting-started)

### 2. Analyze

Before start the development, I need to take a look or identify what data is needed and what data need to store in state. Here the results:

1. I need dummy user data. I can get the data from [https://dummyjson.com/users](https://dummyjson.com/users)
2. I need to store `user`, `filterUser`, `limit`, `sortby`, `total`, `keyword` into state.
3. Because all states connected each other, I decided to use `useReducer`. Why? Because we can update one or multiple states at once in one event. It's easy to manage states using `useReducer` instead of `useState`. If you have ever use Redux, you will understand reducer.

### 3. Start Development

#### 1. Declare initial state

I will create a new file called `state.js` and write initial state on it.

```javascript
const initialState = {
  users: [],
  filterUsers: [],
  keyword: '',
  limit: 5,
  total: 0,
  sortBy: ['id', 'ascending'],
};

export default initialState;

```

Let's elaborate each state!

- **_users_**: store dummy users data got from [https://dummyjson.com/users](https://dummyjson.com/users)
- **_filterUsers_**: will store filtered users from `users` state. I will explain why we need this state in next section.
- **_keyword_**: store value of search input field.
- **_limit_**: store limit number, how many users showed in table. Default value is 5.
- **_total_**: store number of users got from [https://dummyjson.com/users](https://dummyjson.com/users). Default value is 0.
- **_sortBy_**: store `sort by` combination. Default value is `id` with `ascending`
