import ApolloClient, { ApolloQueryResult, QueryOptions } from "apollo-client";
import * as React from "react";

interface ISearchQueryProps {
  children: (v: ISearchQueryRenderArg) => React.ReactNode;
  client: ApolloClient<any>;
  options: QueryOptions;
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
 *     options are the same as those used for the query function of an Apollo
 *     client (https://www.apollographql.com/docs/react/api/apollo-client/).
 *     The data, error and loading properties are updated by the query.
 * loading:
 *     Whether data (for the data property) is being queried at the moment.
 * preload:
 *     Preload data, but do not update the data, error or loading values. The
 *     options are the same as for the fetch method.
 *
 *
 */
class SearchQuery extends React.Component<ISearchQueryProps, any> {
  constructor(props: ISearchQueryProps) {
    super(props);
  }

  componentDidMount(): void {
    this.fetch(this.props.options);
  }

  render() {
    return (
      <>{this.props.children({ ...this.state, fetch: this.fetch } as any)}</>
    );
  }

  fetch = (options: QueryOptions) => {
    if (options.fetchResults === false) {
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
}

export default SearchQuery;
