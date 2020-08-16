import * as React from "react";
import { Flex } from "@chakra-ui/core";
import { components } from "./controls";
const { Box, Image, Badge } = components;

// The app's kind of ugly, so you might want to fix it with
// the visual editor controls. Once it looks good, click download
// and replace the controls.json in the root of this repo with
// the downloaded one to persist your changes.

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
      <Box
        controlsKey="card"
        maxW="sm"
        rounded="lg"
        overflow="hidden"
        bg="white"
      >
        <Image
          controlsKey="card-image"
          height="200px"
          width="100%"
          src={property.imageUrl}
          alt={property.imageAlt}
        />
        <Box p="6">
          <Box d="flex" alignItems="baseline">
            <Badge controlsKey="badge" rounded="full" px="2">
              New
            </Badge>
            <Box
              controlsKey="beds-and-baths"
              color="gray.500"
              fontWeight="semibold"
              letterSpacing="wide"
              fontSize="xs"
              textTransform="uppercase"
              ml="2"
            >
              {property.beds} beds &bull; {property.baths} baths
            </Box>
          </Box>

          <Box
            controlsKey="property-title"
            mt="1"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            isTruncated
            fontSize="lg"
          >
            {property.title}
          </Box>

          <Box controlsKey="price" fontSize="sm">
            {property.formattedPrice}
            <Box as="span" color="gray.600" fontSize="sm">
              / wk
            </Box>
          </Box>
          <Box
            controlsKey="reviews-count"
            d="flex"
            mt="2"
            alignItems="center"
            color="gray.600"
            fontSize="sm"
          >
            {property.reviewCount} reviews
          </Box>
        </Box>
      </Box>
    </Flex>
  );
}

export default App;
