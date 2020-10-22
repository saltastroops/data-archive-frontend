import React from "react";
import { LargeCheckbox } from "../../basicComponents/LargeCheckbox";
import ISearchResultsTableColumn from "./ISearchResultsTableColumn";

interface IManageTableResultHeadersProps {
  closeModal: () => void;
  displayed: ISearchResultsTableColumn[];
  notDisplayed: ISearchResultsTableColumn[];
  onChange: (
    a: ISearchResultsTableColumn[],
    b: ISearchResultsTableColumn[]
  ) => void;
}

interface IManageTableResultHeadersState {
  checked: ISearchResultsTableColumn[];
  left: ISearchResultsTableColumn[];
  leftChecked: ISearchResultsTableColumn[];
  right: ISearchResultsTableColumn[];
  rightChecked: ISearchResultsTableColumn[];
}

export default class ManageTableResultHeaders extends React.Component<
  IManageTableResultHeadersProps,
  IManageTableResultHeadersState
> {
  state: any = {
    checked: [],
    left: this.props.displayed,
    leftChecked: [],
    right: this.props.notDisplayed,
    rightChecked: [],
  };

  handleToggle = (value: any) => () => {
    const currentIndex = this.state.checked.indexOf(value);
    const newChecked = [...this.state.checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      ...this.state,
      checked: newChecked,
      leftChecked: [...intersection(newChecked, this.state.left)],
      rightChecked: [...intersection(newChecked, this.state.right)],
    });
  };

  handleAllRight = () => {
    this.setState({
      ...this.state,
      left: [],
      leftChecked: [],
      right: this.state.right.concat(this.state.left),
      rightChecked: [],
    });
  };

  handleCheckedRight = () => {
    this.setState({
      ...this.state,
      checked: not(this.state.checked, this.state.leftChecked),
      left: not(this.state.left, this.state.leftChecked),
      leftChecked: [],
      right: this.state.right.concat(this.state.leftChecked),
      rightChecked: [],
    });
  };

  handleAllLeft = () => {
    this.setState({
      ...this.state,
      left: this.state.left.concat(this.state.right),
      leftChecked: [],
      right: [],
      rightChecked: [],
    });
  };

  handleCheckedLeft = () => {
    this.setState({
      ...this.state,
      checked: not(this.state.checked, this.state.rightChecked),
      left: this.state.left.concat(this.state.rightChecked),
      leftChecked: [],
      right: not(this.state.right, this.state.rightChecked),
      rightChecked: [],
    });
  };

  updateHeadersToDisplay = () => {
    this.props.onChange(this.state.left, this.state.right);
  };

  render() {
    const { closeModal } = this.props;
    const { checked, left, leftChecked, right, rightChecked } = this.state;

    const customList = (items: any) => (
      <div style={{ marginTop: "5%" }}>
        <ul>
          {items.map((value: any) => {
            const labelId = value.name;
            return (
              <li key={value.dataKey}>
                <LargeCheckbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  onChange={this.handleToggle(value)}
                />{" "}
                {labelId}
              </li>
            );
          })}
        </ul>
      </div>
    );

    return (
      <div className="modal is-active">
        <div className="modal-background" onClick={closeModal} />
        <div className="modal-card column is-mobile is-half is-offset-one-quarter">
          <header className="modal-card-head">
            <p className="modal-card-title">Custom columns to show</p>
            <button
              className="delete"
              aria-label="close"
              onClick={closeModal}
            />
          </header>
          <section className="modal-card-body">
            <div className="columns is-mobile">
              <div className="column">
                <strong>Displayed</strong>
                {customList(left)}
              </div>
              <div className="column is-offset-1">
                <div style={{ marginTop: "25%" }} />
                <button
                  className={"button is-small"}
                  onClick={this.handleAllRight}
                  disabled={left.length === 0}
                  aria-label="move all right"
                >
                  ≫
                </button>
                <br />
                <button
                  className={"button is-small"}
                  onClick={this.handleCheckedRight}
                  disabled={leftChecked.length === 0}
                  aria-label="move selected right"
                >
                  &gt;
                </button>
                <br />
                <button
                  className={"button is-small"}
                  onClick={this.handleCheckedLeft}
                  disabled={rightChecked.length === 0}
                  aria-label="move selected left"
                >
                  &lt;
                </button>
                <br />
                <button
                  className={"button is-small"}
                  onClick={this.handleAllLeft}
                  disabled={right.length === 0}
                  aria-label="move all left"
                >
                  ≪
                </button>
              </div>
              <div className="column">
                <strong>Add to display</strong>
                {customList(right)}
              </div>
            </div>
          </section>
          <footer className="modal-card-foot">
            <button
              className="button is-primary"
              onClick={this.updateHeadersToDisplay}
            >
              Done
            </button>
          </footer>
        </div>
      </div>
    );
  }
}

// Needs relook
const not = (a: any, b: any) => {
  return a.filter((value: any) => b.indexOf(value) === -1);
};

// Needs relook
const intersection = (a: any, b: any) => {
  return a.filter((value: any) => b.indexOf(value) !== -1);
};
