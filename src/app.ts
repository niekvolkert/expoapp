import * as React from 'react';
import * as ReactNativeScript from 'react-nativescript';
import { MainStack } from './components/MainStack';
import { GluestackUIProvider } from "@gluestack-ui/themed";

Object.defineProperty(global, '__DEV__', { value: false });

ReactNativeScript.start(
  React.createElement(
    GluestackUIProvider,
    {},
    React.createElement(MainStack, {}, null)
  )
);