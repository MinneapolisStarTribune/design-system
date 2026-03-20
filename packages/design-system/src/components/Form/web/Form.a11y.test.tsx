import { expectNoA11yViolations } from '@/test-utils/a11y';
import { Form } from './Form';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';
import { FormControl } from '@/components/FormControl/FormControl';

describe('Form Accessibility', () => {
  describe('minimal', () => {
    it('has no violations when form contains only Form.Button', async () => {
      await expectNoA11yViolations(
        <Form onSubmit={() => {}}>
          <Form.Button>Submit</Form.Button>
        </Form>
      );
    });
  });

  describe('integration (Form + FormGroup + control + Form.Button)', () => {
    it('has no violations for a single-field form with label and submit', async () => {
      await expectNoA11yViolations(
        <Form onSubmit={() => {}}>
          <FormGroup>
            <FormGroup.Label>Email</FormGroup.Label>
            <FormControl.TextInput placeholderText="you@example.com" />
          </FormGroup>
          <Form.Button>Submit</Form.Button>
        </Form>
      );
    });

    it('has no violations when error caption is shown (aria-invalid + role="alert")', async () => {
      await expectNoA11yViolations(
        <Form onSubmit={() => {}}>
          <FormGroup>
            <FormGroup.Label>Email</FormGroup.Label>
            <FormControl.TextInput placeholderText="you@example.com" />
            <FormGroup.Caption variant="error">Please enter a valid email</FormGroup.Caption>
          </FormGroup>
          <Form.Button>Submit</Form.Button>
        </Form>
      );
    });

    it('has no violations for horizontal orientation', async () => {
      await expectNoA11yViolations(
        <Form onSubmit={() => {}} orientation="horizontal">
          <FormGroup>
            <FormGroup.Label>Search</FormGroup.Label>
            <FormControl.TextInput placeholderText="Search" />
          </FormGroup>
          <Form.Button>Search</Form.Button>
        </Form>
      );
    });
  });
});
