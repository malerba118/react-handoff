import { Flex, Box, Badge } from "@chakra-ui/core";
import * as React from "react";
import ControlledBox from "./ControlledBox";
import ControlledImage from "./ControlledImage";
import ControlledBadge from "./ControlledBadge";

const property = {
  imageUrl: "https://picsum.photos/id/594/600/400",
  imageAlt: "Home on the water",
  beds: 3,
  baths: 2,
  title: "Humble home on the water",
  formattedPrice: "$500.00",
  reviewCount: 34
};

function App() {
  return (
    <Flex h="100%" justify="center" align="center" bg="gray.200">
      <ControlledBox
        controlsKey="card"
        maxW="sm"
        rounded="lg"
        overflow="hidden"
        bg="white"
      >
        <ControlledImage
          controlsKey="card-image"
          height="200px"
          width="100%"
          src={property.imageUrl}
          alt={property.imageAlt}
        />
        <Box p="6">
          <Box d="flex" alignItems="baseline">
            <ControlledBadge controlsKey="badge" rounded="full" px="2">
              New
            </ControlledBadge>
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
