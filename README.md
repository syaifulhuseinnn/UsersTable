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

- **_state_**: current state condition.
- **_action_**: an object contain `type` and `payload` properties. `type` is a command name, we will tell to reducer function which instruction should run. `payload` contain data, what data we will send to reducer function.

Because reducer will receive various commands, it's easier to write and read multiple conditions using `switch...case`.

- **_SETUSERS_**: handle to update `users` and `filterUsers` state once we get dummy users data from API, fill `users` and `filterUsers` states with dummy users data got from API. And update `total` state with how much data to get.
- **_SETKEYWORD_**: handle keyword typing by visitor. Every visitor type the keyword, it will update `keyword` state. I add conditional statement. If keyword is empty, update `filterUsers` state to the first condition when `SET_USERS` run. The value same as with `users` state.
- **_SETFILTERUSERS_**: this case have relationship with `SET_KEYWORD`. Every visitor type the keyword it will trigger filter function to find user match with the keyword. I write `setFilterUsers` outside reducer function, you can check complete code on repository.
- **_SETLIMIT_**: handle `limit` state. Limit will use for slice the dummy user data.
- **_SETSORTBY_**: handle combination of **Sort By**. It will receive `column` and `order` in action payload. The sorting will process in `setSortBy` function. Add conditional statement, if keyword is not empty, the sorting will update `filterUsers` state.

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

#### 3. Declare useReducer hook

Open `App.js` and declare `useReducer` hook. `useReducer` need two parameters, `reducer` function and `initialState`. `useReducer` will return `state` and `dispatch` function. I can get the return value using array destructuring.

```javascript
const [state, dispatch] = useReducer(reducer, initialState);
```

#### 4. Fetch Dummy Users Data

Let's write request code to fetch dummy users data. I will use native network call in JavaScript, `fetch`. There is no consideration why I'm using `fetch`, it just because this only simple project. Open `App.js` and put code below on it.

Once we success get dummy users data, we can call `SET_USERS` in reducer function bring `type` and `payload` using `dispatch` function. I will send dummy users data to reducer function, so the reducer function can update the state with proper data.

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

Next, I can call the `getUsers` function inside `useEffect` hook. It will fetch dummy users data when first load, because I don't add any dependencies.

```javascript
useEffect(() => {
  getUsers();
}, []);
```

#### 5. Handle Events

I create functions to handle each event.

```javascript
const handleSearchUser = (value) =>
  dispatch({ type: 'SET_KEYWORD', payload: value });

const handleLimit = (value) => {
  dispatch({ type: 'SET_LIMIT', payload: Number(value) });
};

const handleSortBy = (e) => {
  const [column, order] = state.sortBy;
  const payload = { column: column, order: order };
  payload[e.target.name] = e.target.value;

  dispatch({ type: 'SET_SORT_BY', payload: payload });
};
```

#### 6. Handle Filter Users

Look at the previous section, there is no dispatch for `SET_FILTER_USERS`. I add dispatch `SET_FILTER_USERS` in side effect using `useEffect` hook and add state `keyword` as dependecy. The objective is when state `keyword` is not empty or means visitor type keyword into search user input field, it will automatically trigger filter users function. That's why I add state `keyword` as dependecy, because I want the `useEffect` hook listen state `keyword` every time it changes.

```javascript
useEffect(() => {
  if (state.keyword) {
    dispatch({ type: 'SET_FILTER_USERS', payload: state.keyword });
  }
}, [state.keyword]);
```

#### 7. Conditional Rendering

Remember I have two states, `users` and `filterUsers`. When visitor type the keyword into search user input field, it will filter `users` state and store the result into `filterUsers` state.

> _Why I don't store the result into `users` state?_

When keyword is empty I want to show users in table same as when first load. If I store the result into `users` state, we can't get the original users data anymore because the users already filtered. That's why I store the result into `filterUsers` state.

If I want to show users same as when first load, I just need to render from `users` state. If I want to show filtered users, I just need to render from `filterUsers` state.

```javascript
const usersRow = state.keyword
  ? state.filterUsers.users.slice(0, state.limit).map((user) => {
      return (
        <Tr key={user.id}>
          <Td>{`U-${user.id}`}</Td>
          <Td>{user.firstName}</Td>
          <Td>{user.lastName}</Td>
          <Td>{user.age}</Td>
          <Td>{user.email}</Td>
        </Tr>
      );
    })
  : state.users.users.slice(0, state.limit).map((user) => {
      return (
        <Tr key={user.id}>
          <Td>{`U-${user.id}`}</Td>
          <Td>{user.firstName}</Td>
          <Td>{user.lastName}</Td>
          <Td>{user.age}</Td>
          <Td>{user.email}</Td>
        </Tr>
      );
    });
```

### 4. Review

I've learned how to handle states in a good way from this project. Although I still feel annoyed why did I can't finish the test yesterday😩

Hopefully next opportunity I can more relax so I can solve the problems easier😉
