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

#### 1. Declare Initial State

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

#### 2. Setup Reducer

Because I will use `useReducer` so I need to create a reducer. I create a new file called `reducer.js` and put code below on it.

> Remember! a reducer function will receive two paramaters. It's `state` and `action`.
>
> **_state_**: current state condition.
> **_action_**: an object contain `type` and `payload` properties. `type` is a command name, we will tell to reducer function which instruction should run. `payload` contain data, what data we will send to reducer function.

Because reducer will receive various command, it's easier to write and read multiple conditions using `switch...case`.

**\_SET\__USERS_**
Lorem

```javascript
function reducer(state, action) {
  switch (action.type) {
    case 'SET_USERS':
      return {
        ...state,
        users: action.payload,
        filterUsers: action.payload,
        total: action.payload.users.length,
      };
    case 'SET_KEYWORD':
      if (action.payload === '') {
        return {
          ...state,
          keyword: action.payload,
          filterUsers: state.users,
          limit: 5,
          total: state.users.users.length,
        };
      }

      return { ...state, keyword: action.payload };
    case 'SET_FILTER_USERS':
      const keywordToLower = action.payload.toLowerCase();
      const filterUsers = setFilterUsers(state, keywordToLower);

      return {
        ...state,
        filterUsers: { ...state.filterUsers, users: filterUsers },
        limit: filterUsers.length,
        total: filterUsers.length,
      };
    case 'SET_LIMIT':
      return { ...state, limit: action.payload };
    case 'SET_SORT_BY':
      const { column, order } = action.payload;
      const sortUsers = setSortBy(state, column, order);

      if (state.keyword) {
        return {
          ...state,
          filterUsers: { ...state.filterUsers, users: sortUsers },
          sortBy: [column, order],
        };
      }

      return {
        ...state,
        users: { ...state.users, users: sortUsers },
        sortBy: [column, order],
      };

    default:
      return state;
  }
}
```

#### 2. Fetch Dummy Users Data

Let's write request code to fetch dummy users data. I will use native network call in JavaScript, `fetch`. There is no consideration why I'm using `fetch`, it just because this only simple project.

```javascript
const getUsers = async () => {
    try {
      const response = await fetch('https://dummyjson.com/users');
      const dataUsers = await response.json();
      dispatch({ type: 'SET_USERS', payload: dataUsers });
    } catch (error) {
      showToast(error.message);
    }
  };
```
