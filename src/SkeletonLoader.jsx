import {
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  VStack,
  Container,
  Heading,
  Box,
} from '@chakra-ui/react';

function SkeletonLoader() {
  return (
    <Container maxWidth="container.lg" py={4}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Skeleton height="30px" width="120px" mb={12} />
        {[1, 2, 3].map((item) => (
          <>
            <SkeletonText
              skeletonHeight="3"
              width="120px"
              noOfLines={1}
              alignSelf="flex-start"
              mb={4}
            />
            <Skeleton height="30px" width="100%" mb={4} />
          </>
        ))}
        <SkeletonText
          skeletonHeight="3"
          width="120px"
          noOfLines={1}
          alignSelf="flex-start"
          mt={12}
          mb={4}
        />
        {[1, 2, 3, 4, 5, 6, 7].map((item) => (
          <Skeleton height="30px" width="100%" mb={4} />
        ))}
      </Box>
    </Container>
  );
}

export default SkeletonLoader;
