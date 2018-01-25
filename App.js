import React, { Component } from 'react';

import {
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
  View
} from 'react-native';

import { 
  List,
  SearchBar, 
  ListItem } from 'react-native-elements';

export default class App extends Component<{}> {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false
    }

  }

  componentDidMount(){
    this.makeRemoteRequest();
  }


  makeRemoteRequest(){
    const { page, seed } = this.state;
    const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;

    this.setState({
      loading: true
    })

    fetch(url).then(res => res.json() )
        .then(res => {
          this.setState({
            data: page === 1 ? res.results : [...this.state.data, ...res.results],
            error: res.error || null,
            loading: false,
            refreshing: false
          })
        })
        .catch(error => {
          this.setState({
            error, loading: false, refreshing: false
          })
        })

  }

  renderSeparator = () => {

    return (
      <View 
        style={{
          height: 1,
          width: '80%',
          backgroundColor: '#cccccc',
          marginLeft: '16%'
        }}
      ></View>
    )
  }

  renderHeader = () => {
    return (
      <SearchBar placeholder="Search" lightTheme round>
      </SearchBar>
    )
  }

  renderFooter = () => {
    return (
      <View>
        <ActivityIndicator animating size="large"></ActivityIndicator>
      </View>
    )
  }

  handleRefresh =() => {
    this.setState({
      page: 1,
      refreshing: true,
      seed: this.state.seed + 1
    }, () => {
      this.makeRemoteRequest();
    })
  }

  handleLoadMore = () => {
    this.setState({
      page: this.state.page + 1
    }, () => {
      this.makeRemoteRequest();
    })
  };

  render() {
    return (
      <List containerStyle={styles.ListStyle}>
        <FlatList 
          data={this.state.data}
          renderItem={ ({item}) => (
            <ListItem 
              roundAvatar
              title={ `${item.name.first} ${item.name.last}` }
              subtitle={ item.email }
              avatar={{uri: item.picture.thumbnail}}
              containerStyle={{ borderBottomWidth: 0 }}
            />  
          )}
          keyExtractor={item => item.email}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderFooter}
          refreshing={this.state.refreshing}
          onRefresh={this.handleRefresh}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={1}
        />
      </List>
    );
  }
}

const styles = StyleSheet.create({
  ListStyle: {

  }
});
