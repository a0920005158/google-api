import MintUI from 'mint-ui'
import ViewUI from 'view-design';
import StatsCard from '@/components/UIComponents/Cards/StatsCard';
import { Radio, Checkbox, FgInput, Button, DropDown, Card } from '@/components/UIComponents';

const GlobalComponents = {
  install (Vue) {
    Vue.use(MintUI)
    Vue.use(ViewUI);
    Vue.component(Radio.name, Radio)
    Vue.component(Button.name, Button)
    Vue.component(Card.name, Card)
    Vue.component(DropDown.name, DropDown)
    Vue.component(Checkbox.name, Checkbox)
    Vue.component(FgInput.name, FgInput)
    Vue.component(StatsCard.name, StatsCard)
  }
}

export default GlobalComponents
