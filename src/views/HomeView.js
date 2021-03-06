import React from 'react';
import {
  bindActionCreators
}
from 'redux';
import {
  connect
}
from 'react-redux';
import counterActions from 'actions/counter';
import _ from 'lodash';
import $ from 'jquery';

// We define mapStateToProps and mapDispatchToProps where we'd normally use
// the @connect decorator so the data requirements are clear upfront, but then
// export the decorated component after the main class definition so
// the component can be tested w/ and w/o being connected.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
const mapStateToProps = (state) => ({
  counter: state.counter,
  routerState: state.router
});
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(counterActions, dispatch)
});
export class HomeView extends React.Component {
  static propTypes = {
    actions: React.PropTypes.object,
    counter: React.PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = ({
      searchResults: [],
      failedLookup: false
    });
    this.lookup = _.debounce((e) => {
      this.debouncedLookup(e);
    }, 500).bind(this);

    this.handleInput = this.handleInput.bind(this);
  }

  handleInput(e) {
    e.persist();
    this.lookup(e);
  }

  debouncedLookup(e) {
    if(!e.target.value) {
      this.setState({
        searchResult: [],
        failedLookup: false
      });
    } else {
      $.ajax({
        url: 'http://en.wikipedia.org/w/api.php',
        dataType: 'jsonp',
        data: {
          action: 'opensearch',
          format: 'json',
          search: encodeURI(e.target.value)
        }
      })
      .done((data) => {
        this.setState({
          searchResults: data[1]
        });
      });
    }
  }

  //  componentWillMount() {
  //    this.state = ({
  //      searchResults: [],
  //      failedLookup: false
  //    });
  //    this.debounced = _.debounce(function(e) {
  //      if(!e.target.value) {
  //        this.setState({searchResults: [], failedLookup: false});
  //        this.forceUpdate();
  //      } else {
  //        $.ajax({
  //          url: 'http://en.wiipedia.org/w/api.php',
  //          dataType: 'jsonp',
  //          data: {
  //            action: 'opensearch',
  //            format: 'json',
  //            search: encodeURI(e.target.value)
  //          }
  //        }).done(function(data, xhr, stuff) {
  //          this.setState({searchResults: data[1]});
  //        }.bind(this));
  //      }
  //    }, 500);
  //  }

  //  getInitialState() {
  //    return ({
  //      searchResults: [],
  //      failedLookup: false
  //    });
  //  }


  render() {
    //    return (
    //      <div className='container text-center'>
    //        <h1>Welcome to the React Redux Starter Kit</h1>
    //        <h2>Sample Counter: {this.props.counter}</h2>
    //        <button className='btn btn-default'
    //                onClick={this.props.actions.increment}>
    //          Increment
    //        </button>
    //        <button className='btn btn-danger'
    //      onClick={this.props.actions.decrement}>
    //        Decrement
    //      </button>
    //      </div>
    //    );
    // todo


    const results = this.state.searchResults;
    let toDisplay;

    if (results.length) {
      toDisplay = results.map((elem, ix) => {
        return (
            <p key={ix}><a href={'http://en.wikipedia.org/wiki/' + elem}>{elem}
          </a></p>
        );
      });
    } else if (this.state.failedLookup) {
      toDisplay = <p>No results found</p>;
    }

    //    return (
    //      <div className='col-xs-12'>
    //        <input className='search-box' type='text' onChange={this.handleInput}/>
    //        {toDisplay}
    //      </div>
    //    );
    return (
        <div className='col-xs-12'>
        <input className='search-box' type='text' onChange={this.handleInput}/>
        {toDisplay}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);

