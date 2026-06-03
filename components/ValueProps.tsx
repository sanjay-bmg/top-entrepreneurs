import { Building2, Tag, Trophy, Users } from "lucide-react";
import Container from "./Container";
import FadeIn from "./FadeIn";

const props = [
  {
    icon: Building2,
    heading: "Get Listed.",
    body: "Apply to be listed by your city and industry. Every qualifying founder and business owner is accepted.",
  },
  {
    icon: Tag,
    heading: "Add Industries.",
    body: "List your business in every industry you serve — at no extra cost. Reach every customer looking for what you do.",
  },
  {
    icon: Trophy,
    heading: "Earn Recognition.",
    body: "Every listed entrepreneur receives a custom recognition award and is eligible for the Top Entrepreneurs honor.",
  },
  {
    icon: Users,
    heading: "Celebrate Success.",
    body: "Join the exclusive Annual Awards & Recognition Dinner — a night of peer recognition among the builders who define their cities.",
  },
];

export default function ValueProps() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <Container>
        <FadeIn>
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy mb-4">
              Recognizing the Builders Behind Great Businesses.
            </h2>
            <div className="w-12 h-0.5 bg-gold mx-auto mb-5" />
            <p className="text-muted max-w-2xl mx-auto text-lg leading-relaxed">
              TopEntrepreneurs.com is where founders and business owners earn
              recognition and get discovered. Every entrepreneur who applies is
              listed and eligible to be honored.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {props.map(({ icon: Icon, heading, body }, i) => (
            <FadeIn key={heading} delay={i * 0.1}>
              <div className="group text-center p-8 rounded-2xl border border-cream-dark hover:border-gold/50 hover:shadow-lg transition-all duration-300 h-full">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-navy/5 border border-navy/10 mb-5 group-hover:bg-gold/10 group-hover:border-gold/30 transition-colors">
                  <Icon className="h-7 w-7 text-navy group-hover:text-gold transition-colors" />
                </div>
                <h3 className="font-display text-xl font-semibold text-navy mb-3">
                  {heading}
                </h3>
                <p className="text-muted text-sm leading-relaxed">{body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
