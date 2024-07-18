import { ChakraProvider } from '@chakra-ui/react';
import { ApolloProvider } from '@apollo/client';
import client from '../apollo-client';
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;