import { html, TemplateResult } from 'lit';
import '../src/web-brain.js';

export default {
  title: 'WebBrain',
  component: 'web-brain',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  title?: string;
  backgroundColor?: string;
}

const Template: Story<ArgTypes> = ({ title, backgroundColor = 'white' }: ArgTypes) => html`
  <web-brain style="--web-brain-background-color: ${backgroundColor}" .title=${title}></web-brain>
`;

export const App = Template.bind({});
App.args = {
  title: 'My app',
};
