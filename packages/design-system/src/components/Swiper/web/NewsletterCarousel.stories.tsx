import type { Meta, StoryObj } from '@storybook/react-vite';
import { NewsletterCarousel } from './NewsletterCarousel';

const meta: Meta<typeof NewsletterCarousel> = {
    title: 'Components/NewsletterCarousel',
    component: NewsletterCarousel,
};

export default meta;
type Story = StoryObj<typeof NewsletterCarousel>;

const CARDS = [
    { title: 'Behind the Strib', freq: 'MONTHLY', desc: 'Subscriber only: Get exclusive insights and a behind-the-scenes look at the stories shaping Minnesota.' },
    { title: 'Essential Minnesota', freq: 'WEEKDAYS', desc: 'Every weekday, well bring you the mornings hottest talkers and prepare you for the day to come.' },
    { title: 'Evening Update', freq: 'WEEKDAYS', desc: 'Get caught up on the news at 4:30 p.m. each weekday.' },
    { title: 'Hot Dish', freq: 'WEEKDAYS', desc: 'Political news weekday mornings.' },
    { title: 'Breaking News', freq: 'AS IT HAPPENS', desc: 'Get breaking news alerts the moment they happen.' },
    { title: 'Sports Daily', freq: 'WEEKDAYS', desc: 'Your daily dose of Minnesota sports news.' },
];

const MockCard = ({ title, freq, desc }: { title: string; freq: string; desc: string }) => (
    <div style={{
        width: 200,
        border: '1px solid #e5e5e5',
        borderRadius: 12,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        background: '#fff',
    }}>
        <div style={{ width: 48, height: 48, background: '#1a7f4f', borderRadius: 10 }} />
        <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{title}</div>
            <div style={{ fontSize: 11, color: '#888', fontWeight: 600 }}>{freq}</div>
        </div>
        <div style={{ fontSize: 13, color: '#444', flex: 1 }}>{desc}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button style={{ border: '1px solid #ccc', borderRadius: 20, padding: '4px 14px', fontSize: 13, background: 'none', cursor: 'pointer' }}>
                Select
            </button>
            <span style={{ fontSize: 13, color: '#444' }}>Preview ↗</span>
        </div>
    </div>
);

export const Default: Story = {
    render: () => (
        <div style={{ maxWidth: 900, padding: 24 }}>
            <NewsletterCarousel title="News & Politics">
                {CARDS.map((card) => (
                    <NewsletterCarousel.Item key={card.title}>
                        <MockCard {...card} />
                    </NewsletterCarousel.Item>
                ))}
            </NewsletterCarousel>
        </div>
    ),
};

export const FewCards: Story = {
    render: () => (
        <div style={{ maxWidth: 900, padding: 24 }}>
            <NewsletterCarousel title="Greater Minnesota">
                {CARDS.slice(0, 3).map((card) => (
                    <NewsletterCarousel.Item key={card.title}>
                        <MockCard {...card} />
                    </NewsletterCarousel.Item>
                ))}
            </NewsletterCarousel>
        </div>
    ),
};

export const NoTitle: Story = {
    render: () => (
        <div style={{ maxWidth: 900, padding: 24 }}>
            <NewsletterCarousel>
                {CARDS.map((card) => (
                    <NewsletterCarousel.Item key={card.title}>
                        <MockCard {...card} />
                    </NewsletterCarousel.Item>
                ))}
            </NewsletterCarousel>
        </div>
    ),
};