import { Flex, Box, Image, Badge } from "@chakra-ui/core";
import * as React from "react";
import { createControls } from "./controls";
import ControlledBox from "./ControlledBox";
import "./styles.css";

function App() {
  const property = {
    imageUrl: "https://bit.ly/2Z4KKcF",
    imageAlt: "Rear view of modern home with pool",
    beds: 3,
    baths: 2,
    title: "Modern home in city center in the heart of historic Los Angeles",
    formattedPrice: "$1,900.00",
    reviewCount: 34,
    rating: 4
  };

  return (
    <Flex h="100%" justify="center" align="center" bg="gray.200">
      <ControlledBox
        controlsKey="card"
        maxW="sm"
        rounded="lg"
        overflow="hidden"
        bg="white"
      >
        <Image src={property.imageUrl} alt={property.imageAlt} />
        <Box p="6">
          <Box d="flex" alignItems="baseline">
            <Badge rounded="full" px="2" variantColor="teal">
              New
            </Badge>
            <ControlledBox
              controlsKey="beds-and-baths"
              color="gray.500"
              fontWeight="semibold"
              letterSpacing="wide"
              fontSize="xs"
              textTransform="uppercase"
              ml="2"
            >
              {property.beds} beds &bull; {property.baths} baths
            </ControlledBox>
          </Box>

          <ControlledBox
            controlsKey="property-title"
            mt="1"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            isTruncated
            fontSize="lg"
          >
            {property.title}
          </ControlledBox>

          <ControlledBox controlsKey="price" fontSize="sm">
            {property.formattedPrice}
            <Box as="span" color="gray.600" fontSize="sm">
              / wk
            </Box>
          </ControlledBox>

          <ControlledBox
            controlsKey="reviews-count"
            d="flex"
            mt="2"
            alignItems="center"
            color="gray.600"
            fontSize="sm"
          >
            {property.reviewCount} reviews
          </ControlledBox>
        </Box>
      </ControlledBox>
    </Flex>
  );
}

export default App;
