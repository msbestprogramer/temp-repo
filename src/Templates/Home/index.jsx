import './styles.css';

import { Component } from 'react';

import { loadPosts } from '../../utils/load-posts';
import { Posts } from  '../../components/Posts';
import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';

export class Home extends Component {
      state = {
          posts: [],
          allPosts: [],
          page:0,
          postsPerPage:20,
          searchValue: ''
    };

    //componente foi montado
    async componentDidMount(){
       await this.loadPosts();
    } 

    loadPosts = async () => {
      const {page, postsPerPage} = this.state;
      const postsAndPhotos = await loadPosts();      
      this.setState({
        posts: postsAndPhotos.slice(page, postsPerPage),
        allPosts: postsAndPhotos
      }); //
    }

    loadMorePosts = ()=>{
        const {
          page,
          postsPerPage,
          allPosts,
          posts
        } = this.state;
        const nextPage = page + postsPerPage;
        const nextPosts = allPosts.slice(nextPage, nextPage + postsPerPage);
        posts.push(...nextPosts);

        this.setState({ posts, page: nextPage });
    }

    handleChange = (e) =>{
       const { value } = e.target;
       this.setState({ searchValue: value });
    }

    render() {
      //pega do objeto por desestruturacao
      const { posts, page, postsPerPage, allPosts, searchValue } = this.state;
      const noMorePosts = page + postsPerPage >= allPosts.length;
                            // Se existe searchValue
      const filteredPosts = !!searchValue ? 
      posts.filter(post => {
             //filtra os posts incluidos no serchValue
            return post.title.toLowerCase().includes(searchValue.toLowerCase());
      }) : posts;

    return (
      <section className="container">
        <div className="search-container">
          {/* Se existir algo(digitacao) na busca exibir o input */}
          {!!searchValue && (
            <h1>Serach Value: {searchValue}</h1> 
          )}
        
          <TextInput
            searchValue={searchValue}
            handleChange={this.handleChange}
          /> 
        </div>

          {filteredPosts.length > 0 && (
             <Posts posts={filteredPosts}/>
          )}

          {filteredPosts.length === 0 && (
             <p>Não existem posts para serem exibidos</p>
          )}

          <div className="button-container"></div>
             {/* se nao tiver nada na busca quero exibir o botão */}
             {!searchValue && (
                <Button 
                text="Load More Posts"
                onClick={this.loadMorePosts}
                disabled={noMorePosts}
                />
             )}

         <div/>
      </section>
    );     
  }
}
