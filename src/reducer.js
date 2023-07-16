function setFilterUsers(state, keyword) {
  const searchUsersByKeyword = state.users.users.filter((user) => {
    const byFirstName = user.firstName.toLowerCase().includes(keyword);

    const byLastName = user.lastName.toLowerCase().includes(keyword);

    const byEmail = user.email.toLowerCase().includes(keyword);

    return byFirstName || byLastName || byEmail;
  });

  return searchUsersByKeyword;
}

function setSortBy(state, column, order) {
  switch (column) {
    case 'firstName':
    case 'lastName':
      console.log('FIRST NAME!');

      const orderUsersByFirstName = state.users.users.sort((a, b) => {
        const fa = a[`${column}`].toLowerCase();
        const fb = b[`${column}`].toLowerCase();

        if (order === 'descending') {
          if (fa > fb) {
            return -1;
          }
          if (fa < fb) {
            return 1;
          }
          return 0;
        } else {
          if (fa < fb) {
            return -1;
          }
          if (fa > fb) {
            return 1;
          }
          return 0;
        }
      });

      return orderUsersByFirstName;
    case 'age':
    default:
      console.log('DEFAULT!');
      const orderUsersById = state.users.users.sort((a, b) => {
        if (order === 'descending') {
          return b[`${column}`] - a[`${column}`];
        } else {
          return a[`${column}`] - b[`${column}`];
        }
      });
      return orderUsersById;
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USERS':
      return {
        ...state,
        users: action.payload,
        total: action.payload.users.length,
      };
    case 'SET_KEYWORD':
      return { ...state, keyword: action.payload };
    case 'SET_FILTER_USERS':
      const keywordToLower = action.payload.toLowerCase();
      const filterUsers = setFilterUsers(state, keywordToLower);

      return {
        ...state,
        filterUsers: { users: filterUsers },
        limit: filterUsers.length,
        total: filterUsers.length,
      };
    case 'SET_LIMIT':
      return { ...state, limit: action.payload };
    case 'SET_SORT_BY':
      const { column, order } = action.payload;
      const sortUsers = setSortBy(state, column, order);

      return {
        ...state,
        users: { ...state.users, users: sortUsers },
        sortBy: [column, order],
      };

    default:
      return state;
  }
}

export default reducer;
