import ApolloClient, { ApolloQueryResult, QueryOptions } from "apollo-client";
import * as React from "react";

interface ISearchQueryProps {
  children: (v: ISearchQueryRenderArg) => React.ReactNode;
  client: ApolloClient<any>;
  options: QueryOptions;
  skip?: boolean;
}

interface ISearchQueryState {
  data?: ApolloQueryResult<any>;
  error?: Error;
  loading: boolean;
}

interface ISearchQueryRenderArg {
  data?: ApolloQueryResult<any>;
  error?: Error;
  fetch?: (options: QueryOptions) => void;
  loading?: boolean;
}

/*
 * A component for handling a search query.
 *
 * Similarly to Apollo's Query component you must provide a function to the
 * children property, and this function must accept an object as its single
 * argument, which may have the following properties.
 *
 * data:
 *     Data obtained by a query.
 * error:
 *     An error raised while executing a query.
 * fetch:
 *     A function which taken an options object and then performs a query. The
 *     options are the same as those used for the query method of an Apollo
 *     client (https://www.apollographql.com/docs/react/api/apollo-client/).
 *     The data, error and loading properties are updated by the query.
 * loading:
 *     Whether data (for the data property) is being queried at the moment.
 * preload:
 *     Preload data, but do not update the data, error or loading values. The
 *     options are the same as for the fetch method.
 *
 * The component takes the following properties:
 *
 * client:
 *     The Apollo client to use.
 * options:
 *     The query options. These are the same as for the query method of an
 *     Apollo client
 *     (https://www.apollographql.com/docs/react/api/apollo-client/).
 * skip:
 *     Whether to skip, i.e. not to execute a query.
 */
class SearchQuery extends React.Component<
  ISearchQueryProps,
  ISearchQueryState
> {
  state = {
    data: undefined,
    error: undefined,
    loading: false
  };

  componentDidMount(): void {
    this.fetch(this.props.options, !!this.props.skip);
  }

  render() {
    return (
      <>
        {this.props.children({
          ...this.state,
          fetch: this.fetch,
          preload: this.preload
        } as any)}
      </>
    );
  }

  /**
   * Fetch data.
   *
   * The options passed to this method are the same as those for the query
   * method of the Apollo client.
   *
   * Parameters
   * ----------
   * options: QueryOptions
   *     Query options.
   * skip: boolean
   *     Whether the query should be skipped, i.e. not be executed.
   */
  fetch = (options: QueryOptions, skip: boolean) => {
    if (skip) {
      return;
    }
    this.setState(() => ({ data: undefined, error: undefined, loading: true }));
    this.props.client
      .query(options)
      .then(result =>
        this.setState(() => ({
          data: result.data,
          error: undefined,
          loading: false
        }))
      )
      .catch(error =>
        this.setState(() => ({ data: undefined, error, loading: false }))
      );
  };

  /**
   * Preload data.
   *
   * This methods loads the data (so that the cache is updated) but does not
   * update the state. This is mainly intended for preloading data for the
   * next page if pagination is used.
   */
  preload = (options: QueryOptions) => {
    // Load data, but do not update the state
    this.props.client.query(options);
  };
}

export default SearchQuery;
