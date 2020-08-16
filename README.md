# react-handoff

This is a react library POC that bakes into any app a minimal visual editor that enables designers and developers to work in parallel on production code.

## In a nutshell
With this library, **this**:
```tsx
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
```
will give you **[this](https://codesandbox.io/s/async-night-7kyrq?file=/src/App.tsx)**:

![ezgif com-video-to-gif](https://user-images.githubusercontent.com/5760059/90302977-a5a4d280-de6f-11ea-8aa7-b8a93a757fdf.gif)


## How does it work?
This app works similar to the way that theme providers work. By centralizing prop defaults and overrides in a json file and providing them across the app, we can allow components to consume the values they need from the configuration via designated keys. In this demo, `controls.json`
contains all of the values configured via the visual editor.

To set up the code, we first need to call `init`, passing in our defaults and an indication of the environment we're running in (because we don't want editor functionality to show up in prod).

```tsx
import { init } from "./react-handoff";
import defaults from "./controls.json";

const { createControls, ControlsProvider } = init(defaults, {
  allowEditing: process.env.NODE_ENV === "development"
});
```

Once, we've initialized, we need to wrap our app in the `ControlsProvider`. 

```tsx
<ControlsProvider>
    <App />
</ControlsProvider>
```

The `ControlsProvider` allows the `controls.json` values to be accessed anywhere in the app. The `ControlsProvider` also renders the editor sidebar and the active element indicator. 

Next we can use `createControls` to define our editors input fields (similar to the way storybook knobs work).

```tsx
import { select } from "./react-handoff/fields";

const useControls = createControls<ImageControls>({
  key: "Image",
  definitions: {
    objectFit: select(["fill", "contain", "cover"])
  }
});
```

This may seem mysterious, but `select` actually just returns a react component, so you can pass any key/val pair as a definition as long as the key is a string and the value is a component that adheres to the following component interface.

```tsx
type Field<T> = ComponentType<{
    value: T;
    onUpdate: (value: T) => void;
}>
```

Lastly, we have to consume our `useControls` hook.

```tsx
interface ControlledImageProps extends ImageProps {
  controlsKey: string;
}

const ControlledImage: FC<ControlledImageProps> = ({
  controlsKey,
  objectFit,
  ...otherProps
}) => {
  const { attach, values } = useControls({
    subkey: controlsKey,
    passthrough: {
      objectFit
    }
  });

  return (
      <Image 
        {...otherProps} 
        ref={attach} 
        objectFit={values.objectFit} 
      />
  );
};
```

An instance of the `ControlledImage` component would look for the key: `'Image'` and subkey: `controlsKey` in the `controls.json`.

```tsx
// This would have access to values located at
// controlsJson['Image']['card-image']
<ControlledImage controlsKey="card-image" />
```

Internally, the `ControlledImage` component has access to the `values` and `overrides` that live at this location in the `controls.json`.

![Screen Shot 2020-08-14 at 10 06 50 PM](https://user-images.githubusercontent.com/5760059/90303473-e0a90500-de73-11ea-9bac-fec58b68591f.png)


If the passthrough value for `objectFit` is defined when invoking `useControls`, then that value will be passed through to the returned `values` object. However, if the passthrough value for `objectFit` is `undefined` then the value located at `controlsJson['Image']['card-image'].values.objectFit` will be used as a default value. Furthermore, even if the passthrough value for `objectFit` is defined, it can be overriden by checking the "Important" checkbox via the editor controls. 

The `attach` method returned from `useControls` takes in an `HTMLElement` and listens to resize/click events on it. Every time a resize happens, the new dimensions of the active element are propagated to the globally rendered active element indicator (that dashed teal box). This way we can observe the app without polluting it with extra layers of dom crap.

I've only built out a few controls options on a few chakra-ui components, but you can see how it could be extended to all of chakra-ui and other component libraries/custom components as well.

This pattern allows developers to develop and designers to design all at once with all of the power of libraries such as chakra-ui.

## Running locally

```bash
yarn install
yarn start
```