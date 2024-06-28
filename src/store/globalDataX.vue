<script>
  import { mapState, mapMutations, mapAction, mapActions } from 'vuex'

  var baxeX = null
  export default {
    baxeX,
    created: function () {
      baxeX = this
    },
    data () {
      return {

      }
    },
    computed: {
      ...mapState(['$NearbyAttractionsList']),
      ...mapState(['$locationLat']),
      ...mapState(['$locationLng']),
      ...mapState(['$loading']),
      ...mapState(['$Details']),
      ...mapState(['$PhotosUrl']),
      ...mapState(['$user']),
      ...mapState(['$timeLineData']),
      ...mapState(['$Favor']),
      ...mapState(['$RouterPush']),
      ...mapState(['$NowRouter']),
      ...mapState(['$showLoad']),
      ...mapState(['$showLoad2']),
      ...mapState(['$SearchResult']),
      ...mapState(['$WriteStore']),
      ...mapState(['$NoteData'])
    },
    methods: {
      ...mapMutations(['$PostValue']),
      ...mapMutations(['$UpdateTimeLineData']),
      ...mapMutations(['$AddCost']),
      ...mapMutations(['$DeleteCost']),
      ...mapMutations(['$PushValue']),
      ...mapMutations(['$deleteFavor'])
    }
  }
</script>
