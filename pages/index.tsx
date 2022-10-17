import type { NextPage } from "next";
import {
  Badge,
  Box,
  Container,
  HStack,
  SimpleGrid,
  Image,
  Heading,
  Text,
  VStack,
  IconButton,
  Button,
  useBoolean,
  useUpdateEffect,
} from "@chakra-ui/react";
import { BsHeartFill } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import { ONE_SECOND } from "../utils/constants";
import {
  getDays,
  getDiscountedPrize,
  getHours,
  getMinutes,
  getSeconds,
  toDate,
} from "../utils/functions";
import { TimerId } from "../utils/types";
import data from "../public/MOCK_DATA.json";

const LikeButton: React.FC<{ hasLiked: boolean; likes: number }> = (props) => {
  const { hasLiked, likes } = props;
  const [isLiked, { toggle }] = useBoolean(hasLiked);
  const [prodLikes, setProdLikes] = useState(likes);

  useUpdateEffect(
    () =>
      isLiked
        ? setProdLikes((prev) => prev + 1)
        : setProdLikes((prev) => prev - 1),
    [isLiked]
  );

  return (
    <HStack spacing="0.125rem">
      <IconButton
        size="xs"
        variant="unstyled"
        display="flex"
        justifyContent="center"
        alignItems="center"
        color={isLiked ? "pink.600" : "zinc.500"}
        icon={<BsHeartFill size="1rem" />}
        aria-label="like"
        onClick={toggle}
      ></IconButton>

      <Text color={isLiked ? "white" : "zinc.500"}>{prodLikes}</Text>
    </HStack>
  );
};

const SalePrize: React.FC<{
  prize: number;
  discount?: number;
}> = (props) => {
  const { prize, discount } = props;

  return (
    <VStack
      p="2"
      pr="12"
      spacing="0.5"
      align="start"
      pos="relative"
      borderWidth={1}
      borderColor="blue.600"
    >
      <Badge
        pos="absolute"
        top="-9px"
        transform="translate(-50%, 0)"
        left="50%"
        textTransform="uppercase"
        bg="green.600"
        color="white"
        rounded="full"
      >
        {discount}% off
      </Badge>
      <Text
        fontSize="sm"
        fontWeight="semibold"
        textDecoration="line-through"
        color="red.500"
      >
        ${prize}
      </Text>
      <Text fontSize="sm" fontWeight="semibold" color="white">
        ${getDiscountedPrize(discount, prize)}
      </Text>
    </VStack>
  );
};

const AuctionPrize: React.FC<{
  prize: number;
}> = (props) => {
  const { prize } = props;

  return (
    <VStack
      p="2"
      spacing="0.5"
      align="start"
      borderWidth={1}
      borderColor="blue.600"
    >
      <Heading
        as="h4"
        fontSize="xs"
        textTransform="uppercase"
        color="green.500"
      >
        Highest Bid
      </Heading>
      <Text fontSize="sm" fontWeight="semibold" color="white">
        ${prize}
      </Text>
    </VStack>
  );
};

const Duration: React.FC<{
  hasOnSale: boolean;
  auctionEndsIn?: string;
  flashDealEndsIn?: string;
}> = (props) => {
  const { hasOnSale, auctionEndsIn, flashDealEndsIn } = props;
  const [time, setTime] = useState<string>("00:00:00:00");
  const ref = useRef<TimerId>();

  useEffect(() => {
    function getEndTime() {
      const endDate = new Date(
        hasOnSale ? `${flashDealEndsIn}` : `${auctionEndsIn}`
      );
      return endDate;
    }

    const interval = setInterval(() => {
      const countDownDate = getEndTime().getTime();
      const now = new Date().getTime();
      var distance = countDownDate - now;
      const isNotExpired = distance >= 0;

      if (isNotExpired) {
        const remainTime = toDate(
          getDays(distance),
          getHours(distance),
          getMinutes(distance),
          getSeconds(distance)
        );
        setTime(remainTime);
      } else {
        clearInterval(ref.current);
      }
    }, ONE_SECOND);

    return () => clearInterval(interval);
  }, [hasOnSale, flashDealEndsIn, auctionEndsIn]);

  return (
    <VStack
      p="2"
      spacing="0.5"
      borderWidth={1}
      borderColor="yellow.600"
      flexGrow={1}
    >
      <Heading
        as="h4"
        fontSize="xs"
        textTransform="uppercase"
        color="brandBlue.300"
      >
        {hasOnSale ? "flash deal ends in" : "Auction ends in"}
      </Heading>
      <Text fontSize="sm" fontWeight="semibold" color="white">
        {time}s
      </Text>
    </VStack>
  );
};

const Card: React.FC<{
  hasOnSale: boolean;
  hasLiked: boolean;
  tag: string;
  name: string;
  likes: number;
  flashDealEndsIn?: string;
  auctionEndsIn?: string;
  previousPrize?: string;
  discount?: number;
  prize: number;
}> = (props) => {
  const {
    hasLiked,
    hasOnSale,
    name,
    prize,
    tag,
    likes,
    discount,
    auctionEndsIn,
    flashDealEndsIn,
  } = props;

  return (
    <Box p="6" boxShadow="md" rounded="md" bg="blue.900">
      <HStack justify="space-between">
        <Badge
          px="2"
          py="0.5"
          variant="outline"
          rounded="full"
          textTransform="initial"
          colorScheme="gray"
        >
          Hot Deal
        </Badge>

        {hasOnSale ? (
          <Badge
            px="2"
            py="0.5"
            variant="outline"
            rounded="full"
            colorScheme="indigo"
            color="white"
          >
            Sale
          </Badge>
        ) : (
          <Badge
            px="2"
            py="0.5"
            variant="outline"
            rounded="full"
            colorScheme="yellow"
            color="white"
          >
            Auction
          </Badge>
        )}
      </HStack>

      <Box mt="4">
        <Image
          src="https://source.unsplash.com/random"
          h="48"
          w="full"
          objectFit="cover"
          rounded="sm"
        />
      </Box>

      <HStack justify="space-between" mt="4">
        <VStack spacing="0.5" align="start">
          <Heading as="h4" fontSize="md" fontWeight="medium" color="white">
            {tag}
          </Heading>
          <Text fontSize="sm" fontWeight="medium" color="blue.500">
            {name}
          </Text>
        </VStack>

        <LikeButton hasLiked={hasLiked} likes={likes} />
      </HStack>

      <HStack spacing="4" mt="6">
        {hasOnSale ? (
          <SalePrize prize={prize} discount={discount} />
        ) : (
          <AuctionPrize prize={prize} />
        )}
        <Duration
          hasOnSale={hasOnSale}
          flashDealEndsIn={flashDealEndsIn}
          auctionEndsIn={auctionEndsIn}
        />
      </HStack>

      <Box mt="4">
        {hasOnSale ? (
          <HStack>
            <Button
              w="full"
              rounded="none"
              variant="outline"
              colorScheme="whiteAlpha"
              textTransform="uppercase"
            >
              Add to cart
            </Button>
            <Button
              w="full"
              rounded="none"
              colorScheme="brandBlue"
              textTransform="uppercase"
            >
              Buy now
            </Button>
          </HStack>
        ) : (
          <Button
            w="full"
            rounded="none"
            colorScheme="brandBlue"
            textTransform="uppercase"
          >
            Bid now
          </Button>
        )}
      </Box>
    </Box>
  );
};

const Home: NextPage = () => {
  return (
    <Container maxW="container.xl" p={{ base: 4, md: 6, lg: 8 }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, xl: 3 }}
        spacing={{ base: 8, lg: 12 }}
      >
        {data.map(({ id, ...props }) => (
          <Card key={id} {...props} />
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default Home;
