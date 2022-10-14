<template>
    <div id="perfil">    
      <div class="postarea loading" v-if="loading">
        Buscando posts..
      </div>

      <div v-else>
        <div class="headerPerfil">
          <h2>{{nome}}</h2>  
          <span>Já fez <strong>{{this.posts.length}}</strong> posts</span>
        </div>

        <div class="postarea">
          <article class="post" v-for="post in posts" :key="post.id">
            <h1>{{post.autor}}</h1>
            <p>{{post.content}}</p>
            <div class="action-post">
              <button @click="toggleModal(post)">Veja post completo</button>
            </div>
          </article>
        </div>
      </div>

      <Modal         
        @close="toggleModal"
        v-if="showPostModal"
        :post="fullPost"        
      >
    </Modal>
    </div>
  </template>
  
  <script>
  import firebase from '../services/firebaseConnection';
  import Modal from '../components/Modal.vue';
 
  export default {
    name: 'PerfilApp', 
    components:{
      Modal
    },
    data(){
      return{
        loading: true,
        showPostModal: false,
        fullPost: {},
        posts: [],
        nome: '',
        user: {}
      }
    },
    props: ['userid'],
    async created(){
      const user = localStorage.getItem('devpost');
      this.user = JSON.parse(user);

      await firebase.firestore().collection('posts')
      .where('userId', '==', this.userid)
      .orderBy('created', 'desc')
      .onSnapshot((snapshot)=>{
        this.posts = [];

        snapshot.forEach((doc)=>{
          this.posts.push({
            id: doc.id,
            autor: doc.data().autor,
            content: doc.data().content,
            likes: doc.data().likes,
            created: doc.data().created,
            userId: doc.data().userId
          });
        })

        this.nome = this.posts[0].autor;
        this.loading = false;
      })
    },
    methods:{
      toggleModal(post){
        this.showPostModal = !this.showPostModal;

        if(this.showPostModal){
          this.fullPost = post;
        }else{
          this.fullPost = {};
        }
      }
    }
  }
  </script>
  
  <style scoped>
   .postarea{
      background: #757575;     
      padding: 10px 10px;
      color: white;
      flex-direction: column;
      margin-left: 10px;
      width: 400px;
    }

    .headerPerfil{
      color: #FFF;
    }

    .headerPerfil{
      padding: 10px 10px;
    }
  </style>
  