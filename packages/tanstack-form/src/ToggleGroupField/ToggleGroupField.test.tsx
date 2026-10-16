import { ToggleGroup } from '@minneapolisstartribune/design-system/web';
import { useForm } from '@tanstack/react-form';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SubmitForm } from '../test-utils/SubmitForm';
import { ToggleGroupField } from './ToggleGroupField';

type View = 'list' | 'grid';

describe('ToggleGroupField', () => {
  it('single: labels the radiogroup and writes the picked value', async () => {
    const onSubmit = vi.fn();
    const Fixture = () => {
      const form = useForm({
        defaultValues: { view: 'list' as View },
        onSubmit: ({ value }) => onSubmit(value),
      });
      return (
        <SubmitForm form={form}>
          <form.Field name="view">
            {(field) => (
              <ToggleGroupField field={field} label="View">
                <ToggleGroup.Item value="list">List</ToggleGroup.Item>
                <ToggleGroup.Item value="grid">Grid</ToggleGroup.Item>
              </ToggleGroupField>
            )}
          </form.Field>
        </SubmitForm>
      );
    };
    render(<Fixture />);

    expect(screen.getByRole('radiogroup', { name: 'View' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'List' })).toBeChecked();
    await userEvent.click(screen.getByRole('radio', { name: 'Grid' }));
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalledWith({ view: 'grid' });
  });

  it('multiple: writes an array and shows the error once focus leaves', async () => {
    const onSubmit = vi.fn();
    const Fixture = () => {
      const form = useForm({
        defaultValues: { sections: ['news'] },
        onSubmit: ({ value }) => onSubmit(value),
      });
      return (
        <SubmitForm form={form}>
          <form.Field
            name="sections"
            validators={{
              onChange: ({ value }) => (value.length > 0 ? undefined : 'Pick a section'),
            }}
          >
            {(field) => (
              <ToggleGroupField type="multiple" field={field} label="Sections">
                <ToggleGroup.Item value="news">News</ToggleGroup.Item>
                <ToggleGroup.Item value="sports">Sports</ToggleGroup.Item>
              </ToggleGroupField>
            )}
          </form.Field>
        </SubmitForm>
      );
    };
    render(<Fixture />);

    expect(screen.getByRole('group', { name: 'Sections' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('checkbox', { name: 'Sports' }));
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onSubmit).toHaveBeenCalledWith({ sections: ['news', 'sports'] });

    await userEvent.click(screen.getByRole('checkbox', { name: 'News' }));
    await userEvent.click(screen.getByRole('checkbox', { name: 'Sports' }));
    await userEvent.tab();

    expect(screen.getByRole('alert')).toHaveTextContent('Pick a section');
  });

  it('keeps a passed aria-describedby alongside its own caption', () => {
    const Fixture = () => {
      const form = useForm({ defaultValues: { view: 'list' as View } });
      return (
        <>
          <p id="view-help">Applies everywhere</p>
          <form.Field name="view">
            {(field) => (
              <ToggleGroupField
                field={field}
                label="View"
                caption="Pick one"
                aria-describedby="view-help"
              >
                <ToggleGroup.Item value="list">List</ToggleGroup.Item>
              </ToggleGroupField>
            )}
          </form.Field>
        </>
      );
    };
    render(<Fixture />);

    expect(screen.getByRole('radiogroup', { name: 'View' })).toHaveAccessibleDescription(
      'Applies everywhere Pick one'
    );
  });

  it('needs a label or aria-labelledby, and the right field type for the mode', () => {
    const Fixture = () => {
      const form = useForm({ defaultValues: { view: 'list', views: ['list'] } });
      return (
        <>
          <form.Field name="view">
            {(field) => (
              // @ts-expect-error the group needs a name
              <ToggleGroupField field={field}>
                <ToggleGroup.Item value="list">List</ToggleGroup.Item>
              </ToggleGroupField>
            )}
          </form.Field>
          <form.Field name="views">
            {(field) => (
              // @ts-expect-error single mode needs a string field
              <ToggleGroupField field={field} label="Views">
                <ToggleGroup.Item value="list">List</ToggleGroup.Item>
              </ToggleGroupField>
            )}
          </form.Field>
        </>
      );
    };
    expect(Fixture).toBeDefined();
  });
});
