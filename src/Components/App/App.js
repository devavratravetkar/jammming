import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

const defaultPlaylistName = 'Untitled Playlist';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistName: defaultPlaylistName,
      playlistTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.search = this.search.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);

  }

  addTrack(track) {
    let trackAlreadyExists = false;
    this.state.playlistTracks.forEach(oldTrack => {
      if(oldTrack.id === track.id){
        trackAlreadyExists = true;
      }
    });
    if(!trackAlreadyExists) {
      //console.log('Track not in playlist');
      // console.log(this.state.playlistTracks);
      this.setState({
        playlistTracks: this.state.playlistTracks.concat([track])
      });
      // console.log(this.state.playlistTracks);
    } else {
      console.log('Track already in playlist');
    }

    // let tracks = this.state.playlistTracks;
    // if (!tracks.includes(track)){
    //   this.setState({
    //     playlistTracks: this.state.playlistTracks.concat([track])
    //   });
    // } else {
    //   console.log('Track already in playlist');
    // }
  }

  removeTrack(track) {
    this.setState({
      playlistTracks: this.state.playlistTracks.filter((oldTrack) => oldTrack.id !== track.id)
    });
  }

  updatePlaylistName(newName) {
    this.setState({
      playlistName: newName
    });
  }

  search(term) {
    console.log(term);
    Spotify.search(term).then(searchResults => {
      this.setState({
        searchResults: searchResults
      });
    });
  }

  savePlaylist() {
    let trackUris = [];
    let name = this.state.playlistName;
    this.state.playlistTracks.forEach(track => trackUris.push(track.uri));
    Spotify.savePlaylist(name, trackUris).then(() => {
      this.setState({
        searchResults: [],
        playlistName: defaultPlaylistName,
        playlistTracks: []
      });
      document.getElementsByTagName("input")[0].value = '';
      document.getElementsByTagName("input")[1].value = defaultPlaylistName;
    });

  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onSave={this.savePlaylist} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
