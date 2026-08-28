import React, { useState, useEffect } from 'react';

const SECTION_ORDER = ['profile', 'experience', 'case-studies', 'skills', 'education'];
const SECTION_LABELS = {
  profile: 'Profile',
  experience: 'Experience',
  'case-studies': 'Case Studies',
  skills: 'Technical Skills',
  education: 'Education',
};

// Height of the fixed top nav a title must scroll behind to count as "exited".
const NAV_HEIGHT = 56;

export default function CV() {
  const [trackerId, setTrackerId] = useState(null);

  useEffect(() => {
    const titles = SECTION_ORDER
      .map(id => ({ id, el: document.querySelector(`#${id} .section-label`) }))
      .filter(t => t.el);
    if (!titles.length) return;

    const scroller = document.body.scrollHeight > document.body.clientHeight
      ? document.body
      : document.documentElement;

    let raf = null;
    const update = () => {
      raf = null;
      // The tracker itself sits vertically centered in the viewport.
      const trackerY = window.innerHeight / 2;

      // Most-recently-passed title: the last one that has fully
      // scrolled behind the fixed nav.
      let currentIndex = -1;
      for (let i = 0; i < titles.length; i++) {
        if (titles[i].el.getBoundingClientRect().bottom <= NAV_HEIGHT) currentIndex = i;
      }
      if (currentIndex === -1) {
        setTrackerId(null);
        return;
      }

      // Once the *next* section's real title scrolls up level with the
      // tracker's row, hide the tracker so the two don't overlap; it
      // reappears (now for that next section) once that title itself
      // exits behind the nav.
      const next = titles[currentIndex + 1];
      const collidingWithNext = next && next.el.getBoundingClientRect().top <= trackerY;

      setTrackerId(collidingWithNext ? null : titles[currentIndex].id);
    };
    const onScroll = () => {
      if (raf == null) raf = requestAnimationFrame(update);
    };

    update();
    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      scroller.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {trackerId && (
        <aside className="section-tracker" aria-hidden="true">
          <span key={trackerId} className="section-tracker-text">{SECTION_LABELS[trackerId]}</span>
        </aside>
      )}
      <header className="page-header cv-page">
        <div className="page-header-inner">
          <p className="page-header-eyebrow">Seattle, WA</p>
          <h1 className="page-header-title">Harry Hamlin</h1>
          <p className="page-header-tagline">Operations Executive and Technical Leader</p>
          <div className="page-header-contact">
            <a href="mailto:harryhamlin@gmail.com">harryhamlin@gmail.com</a>
            <span>Seattle, WA</span>
          </div>
        </div>
      </header>

      <main className="page-main cv-page">
        <section className="page-section reveal" id="profile">
          <p className="section-label">Profile</p>
          <p>I spent a decade leading climbers on the world's highest peaks before taking over day-to-day leadership of International Mountain Guides, one of the most renowned guide services in the world. As Director of Operations and General Manager, I ran a 40+ person operation while personally architecting the company's registration, payments, and labor-forecasting infrastructure.</p>
          <p style={{ marginTop: '18px' }}>That combination is the through-line of my career: high-consequence leadership paired with hands-on systems building. I write production JavaScript, design data models, and use AI tools daily: for code, for marketing content, for customer communications, and for the analytical models that drive pricing and payroll decisions. Whether the problem is a race condition in a checkout flow or a contentious compensation overhaul, my approach is the same: gather real data, build a defensible system, and bring the team along.</p>
        </section>

        <section className="page-section reveal" id="experience">
          <p className="section-label">Experience</p>

          <div className="role">
            <div className="role-head"><h3>Director of Operations / General Manager</h3><span className="dates">Jan 2021 – June 2026</span></div>
            <p className="org">International Mountain Guides · Ashford, WA</p>
            <ul>
              <li>Full P&amp;L and operational leadership of a premier international guide service: hiring, training, performance management, and development for a 40+ person team of guides, administrators, and contractors.</li>
              <li>Achieved <b>20% year-over-year growth</b> through new product development, data-informed pricing, and targeted marketing; grew total revenue <b>30% over five years</b> by pricing to demand elasticity, moving the catalog from selling out in a month to a controlled ~90% annual sell-through.</li>
              <li>Designed and rolled out an industry-first overhaul of a decades-old day-rate pay system, and similar structures were subsequently adopted elsewhere in the industry. Full story below.</li>
              <li>Architected the company's customer registration system, payment processing migration, and real-time labor cost model; directed PCI-compliant payments, cybersecurity implementation, and a back-end email migration enabling CRM integration.</li>
              <li>Integrated AI tools into daily operations: LLM coding assistants for internal system development, AI-assisted marketing informed by customer engagement data, AI-drafted customer communications at scale, and AI-assisted analysis in forecasting and pricing work.</li>
              <li>Developed COVID-19 operating policy in collaboration with government agencies, physicians, and industry partners; ensured compliance with federal contracting and land-use permit regulations while maximizing performance.</li>
              <li>Handled sensitive personnel matters, including terminations, restructuring, difficult negotiations; with documented process and follow-through that preserved morale and key relationships.</li>
            </ul>
          </div>

          <div className="role">
            <div className="role-head"><h3>Senior Supervising Guide / Everest Expedition Team Leader</h3><span className="dates">Jun 2016 – Jan 2021</span></div>
            <p className="org">International Mountain Guides</p>
            <ul>
              <li>Led teams of 2–10 guides and staff in extreme, high-consequence environments, managing risk, expectations, and wellbeing for staff and clientele in hyper objective-based guiding.</li>
              <li>Led 50+ successful summits worldwide, including Mt Everest, Mt Rainier, Ama Dablam and Kilimanjaro, and directed high-hazard rescues when required.</li>
              <li>Balanced client-facing and staff-facing communication when implementing strategy, building the judgment that later anchored executive crisis management.</li>
            </ul>
          </div>

          <div className="role">
            <div className="role-head"><h3>Additional Leadership</h3></div>
            <ul>
              <li><b>Shift Supervisor</b>, Crystal Mountain Ski Patrol · 2014 – 2019</li>
              <li><b>Avalanche Education Course Leader</b>, AIARE · 2017 – Present</li>
            </ul>
          </div>
        </section>

        <section className="page-section reveal" id="case-studies">
          <p className="section-label">Case Studies</p>

          <div className="case">
            <h3>Overhauling a decades-old pay system</h3>
            <p className="case-tags">Compensation design · Data modeling · Change management · Compliance</p>
            <p><span className="lbl">Situation</span>Regulators were pressuring us to replace an entrenched day-rate pay structure with one compliant with Washington L&amp;I record-keeping and minimum-wage requirements, plus the employment rules that apply to federal contractors, all without alienating a trepidatious workforce.</p>
            <p><span className="lbl">Approach</span>I ran a months-long timeclock study to establish real average hours by job type, then backed out a tiered hourly wage structure (seniority- and responsibility-weighted) that defensibly compared to the old system. I built a payroll forecast model against the following year's sold programs, held it within an approved percentage of prior-year costs, and ran the rewritten policy through a Washington employment lawyer. Rollout happened through round-table sessions with worked pay comparisons and open Q&amp;A.</p>
            <p className="outcome"><span className="lbl">Outcome</span>The rollout landed: payroll costs tracked forecast, employee acceptance held through the transition, and the structure was subsequently mimicked by much of the industry.</p>
          </div>

          <div className="case">
            <h3>Solving a race condition in program registration</h3>
            <p className="case-tags">Systems design · Concurrency · Customer experience</p>
            <p><span className="lbl">Situation</span>Our product releases triggered a purchase rush that risked overbooking the most desirable programs, a direct hit to customer satisfaction on our flagship offerings.</p>
            <p><span className="lbl">Approach</span>Working within the constraints of the platforms involved (AirTable, DocuSign, Zapier), I designed the checkout to minimize the exposure window of an available spot to the 20–30 seconds a customer spends entering critical information, the closest achievable approximation of mutual exclusion that still captured prospect data for marketing. If two customers cleared the gate for the same last spot, the system halted before issuing DocuSigns or opening the payment gateway, routing both to white-glove manual handling under a last-writer-wins policy.</p>
            <p className="outcome"><span className="lbl">Outcome</span>Only four customers across two last-spot conflicts ever reached the exception path; all were resolved manually without friction. Subsequent API updates and strategic release timing drove the rate down further over the following three years.</p>
          </div>

          <div className="case">
            <h3>Ending a climbing season early</h3>
            <p className="case-tags">Crisis decision-making · Financial analysis · Communications</p>
            <p><span className="lbl">Situation</span>Deteriorating conditions, competitor departures, and pointed public remarks from the park put the remainder of the season in doubt, despite our own assessment that conditions remained safely climbable.</p>
            <p><span className="lbl">Approach</span>I quantified the decision for ownership: net unrealized profit on cancelled programs as a share of expected summer profits (~10%). Given the publicity risk, we ended early. Because holding deposits incurred the least processing cost, I built an incentive giving deposit-holders first pick of desirable future programs, stood up a registration portal for client preferences, briefed staff with a reference memo, updated marketing copy across web and social, and communicated directly with every affected client.</p>
            <p className="outcome"><span className="lbl">Outcome</span>~25% of deposits stayed on hold and a further 50% of affected clients re-registered the following summer; interest on retained deposits offset losses, and the communication held customer trust through a cancellation event.</p>
          </div>

          <div className="case">
            <h3>Migrating payment processing to Stripe</h3>
            <p className="case-tags">Vendor evaluation · API integration · Training · Zero-defect launch</p>
            <p><span className="lbl">Situation</span>Our merchant processor couldn't meet the API data-pass-through needs of the registration system I'd built, and we needed compatibility with the DocuSign Payments gateway.</p>
            <p><span className="lbl">Approach</span>I narrowed the field to two processors meeting both technical requirements, negotiated quotes against our transaction volume, selected Stripe on rate and API capability, built a test environment, rewrote training materials, and ran seminars with administrative staff before integrating into the live registration system.</p>
            <p className="outcome"><span className="lbl">Outcome</span>Launch with zero implementation defects. Marginal rate savings (~0.3%), but the real win was Stripe's data-transfer capability, unlocking far greater complexity in record-keeping and downstream design.</p>
          </div>

          <div className="case">
            <h3>Real-time labor cost modeling</h3>
            <p className="case-tags">Forecasting · Excel modeling · Cost control</p>
            <p><span className="lbl">Situation</span>The new pay system introduced payroll uncertainty; overtime needed to be minimized and budget targets defended.</p>
            <p><span className="lbl">Approach</span>I built a model that monitored our scheduling program for changes and forecast weekly payroll (total and overtime) by combining per-day best guesses with the results of a year-long logged-hours study, benchmarked against prior-year actuals and current budgets. The CFO and I used it as a live scheduling monitor.</p>
            <p className="outcome"><span className="lbl">Outcome</span>Forecasts landed within 5% of real payroll costs, and the model was extended through subsequent pay-system updates for year-over-year monitoring.</p>
          </div>

          <div className="case">
            <h3>Pricing to demand elasticity</h3>
            <p className="case-tags">Pricing strategy · Market analysis · Revenue growth</p>
            <p><span className="lbl">Situation</span>When I took over, the product catalog sold out within a month of release, a clear signal of underpricing and missed revenue.</p>
            <p><span className="lbl">Approach</span>Each annual cycle I forecast the remainder of the fiscal year's costs, gathered competitive intelligence on high- and low-end market moves, analyzed our sales response to prior increases, factored inflation and CPI, and brought ownership to a pricing decision, then coordinated staff on marketing updates and land-manager submissions.</p>
            <p className="outcome"><span className="lbl">Outcome</span>Five years in, we sold ~90% of catalog at a 30% revenue increase, reaching price elasticity and effectively maximizing revenue through pricing alone.</p>
          </div>
        </section>

        <section className="page-section reveal" id="skills">
          <p className="section-label">Technical Skills</p>
          <div className="skill-grid">
            <div className="skill-block">
              <h3>Development</h3>
              <p>Full-stack web development with practical deployment experience.</p>
              <div className="chips">
                <span className="chip">HTML/CSS</span><span className="chip">JavaScript</span><span className="chip">React</span>
                <span className="chip">Node.js</span><span className="chip">MySQL</span><span className="chip">MongoDB</span>
                <span className="chip">REST APIs</span><span className="chip">Bootstrap</span>
              </div>
            </div>
            <div className="skill-block">
              <h3>Applied AI</h3>
              <p>Daily working use of LLMs across the business.</p>
              <div className="chips">
                <span className="chip">Claude</span><span className="chip">ChatGPT</span><span className="chip">Claude Code</span>
                <span className="chip">AI-assisted analysis</span><span className="chip">Content workflows</span>
              </div>
            </div>
            <div className="skill-block">
              <h3>Systems &amp; Integration</h3>
              <p>Platform integration and automation for production business systems.</p>
              <div className="chips">
                <span className="chip">Stripe</span><span className="chip">DocuSign</span><span className="chip">AirTable</span>
                <span className="chip">Zapier</span><span className="chip">Excel modeling</span><span className="chip">CRM</span>
              </div>
            </div>
            <div className="skill-block">
              <h3>Compliance &amp; Operations</h3>
              <p>Regulatory navigation in high-scrutiny environments.</p>
              <div className="chips">
                <span className="chip">PCI compliance</span><span className="chip">Federal contracting</span>
                <span className="chip">WA labor law</span><span className="chip">Land-use permitting</span>
                <span className="chip">Risk management</span>
              </div>
            </div>
          </div>
        </section>

        <section className="page-section reveal" id="education">
          <p className="section-label">Education</p>
          <div className="edu">
            <h3>Web Development Bootcamp · University of Washington</h3>
            <span className="dates">Oct 2022 – May 2023</span>
            <p>200+ hours of instruction with weekly deployed projects: JavaScript, React, Node.js, MySQL, MongoDB, server-side development, and API design.</p>
          </div>
          <div className="edu">
            <h3>B.S. Chemistry · University of Puget Sound</h3>
            <span className="dates">May 2012</span>
            <p>Tacoma, WA</p>
          </div>
        </section>
      </main>
    </>
  );
}
