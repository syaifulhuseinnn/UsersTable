import { useRef, useEffect, useReducer } from 'react';
import {
  Heading,
  Container,
  Input,
  Stack,
  FormControl,
  FormLabel,
  FormHelperText,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Text,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import initialState from './state';
import reducer from './reducer';
import SkeletonLoader from './SkeletonLoader';

function App() {
  const toast = useToast();
  const toastIdRef = useRef();
  const [state, dispatch] = useReducer(reducer, initialState);

  const showToast = (message) => {
    toastIdRef.current = toast({
      title: 'Error',
      description: message,
      status: 'error',
    });
  };

  const getUsers = async () => {
    try {
      const response = await fetch('http://httpstat.us/500');
      const dataUsers = await response.json();
      dispatch({ type: 'SET_USERS', payload: dataUsers });
    } catch (error) {
      console.error(error?.message);
      showToast(error.message);
    }
  };

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

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (state.keyword) {
      dispatch({ type: 'SET_FILTER_USERS', payload: state.keyword });
    }
  }, [state.keyword]);

  if (state.users.length < 1) {
    return <SkeletonLoader />;
  }

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

  return (
    <Container maxWidth="container.lg" py={4}>
      <Heading textAlign="center">Users</Heading>
      <Stack>
        <FormControl>
          <FormLabel>Search user</FormLabel>
          <Input
            type="text"
            placeholder="Search user"
            value={state.keyword}
            onChange={(e) => handleSearchUser(e.target.value)}
          />
          <FormHelperText>
            <HStack>
              <InfoIcon />
              <span>
                You can search user by First Name, Last Name, and Email Address
              </span>
            </HStack>
          </FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>Limit</FormLabel>
          <NumberInput
            value={state.limit} // default limit
            min={1}
            max={state.total}
            keepWithinRange={true}
            clampValueOnBlur={true}
            onChange={(number) => handleLimit(number)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl>
          <FormLabel>Sort by</FormLabel>
          <Select
            marginBottom={4}
            name="column"
            onChange={(e) => handleSortBy(e)}
          >
            <option value="id">ID</option>
            <option value="firstName">First Name</option>
            <option value="lastName">Last Name</option>
            <option value="age">Age</option>
          </Select>
          <Select name="order" onChange={(e) => handleSortBy(e)}>
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
          </Select>
        </FormControl>
      </Stack>
      <TableContainer mt={6}>
        <Text>Total: {state.total}</Text>
        <Table variant="striped" colorScheme="teal">
          <TableCaption>User Accounts</TableCaption>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>First Name</Th>
              <Th>Last Name</Th>
              <Th>Age</Th>
              <Th>Email</Th>
            </Tr>
          </Thead>
          <Tbody>{usersRow}</Tbody>
          <Tfoot>
            <Tr>
              <Th>ID</Th>
              <Th>First Name</Th>
              <Th>Last Name</Th>
              <Th>Age</Th>
              <Th>Email</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default App;
