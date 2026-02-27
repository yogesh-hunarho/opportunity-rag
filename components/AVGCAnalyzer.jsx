"use client";

import React, { useState, useMemo } from 'react';

const AVGCAnalyzer = ({ data }) => {
  const [activeSection, setActiveSection] = useState('opportunities');
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [checkedItems, setCheckedItems] = useState({});

  const toggleCard = (index) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCards(newExpanded);
  };

  const toggleCheck = (id) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const checklistProgress = useMemo(() => {
    const totalItems = data.sections.checklist.categories.reduce((acc, cat) => acc + cat.items.length, 0);
    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    return Math.round((checkedCount / totalItems) * 100);
  }, [checkedItems]);

  const renderSection = () => {
    switch (activeSection) {
      case 'opportunities':
        return (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold mb-1.5">{data?.sections?.opportunities?.title}</h2>
            <p className="text-sm text-muted-foreground mb-6">{data?.sections?.opportunities?.subtitle}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
              {data?.sections?.opportunities?.items?.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleCard(idx)}
                  className={`group relative bg-card border border-border rounded-xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl overflow-hidden`}
                >
                  <div className={`absolute top-0 left-0 right-0 h-[3px] bg-linear-to-r ${
                    item.color === 'green' ? 'from-[#10b981] to-[#34d399]' :
                    item.color === 'blue' ? 'from-[#3b82f6] to-[#60a5fa]' :
                    item.color === 'purple' ? 'from-[#8b5cf6] to-[#a78bfa]' :
                    'from-[#f59e0b] to-[#fcd34d]'
                  }`} />
                  
                  <div className="flex justify-between items-start mb-3">
                    <div className="text-3xl">{item.icon}</div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      item.pillType === 'hot' ? 'bg-[#7c2d12] text-white' :
                      item.pillType === 'high' ? 'bg-[#064e3b] text-[#34d399]' :
                      'bg-[#1e3a5f] text-primary'
                    }`}>
                      {item.pill}
                    </span>
                  </div>
                  
                  <h4 className="text-base font-bold mb-1.5">{item.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  
                  <div className="flex gap-3 mt-3.5">
                    {item?.meta?.map((m, midx) => (
                      <div key={midx} className="text-[11px] text-primary">
                        {m.label}: <span className="text-primary font-semibold">{m.val}</span>
                      </div>
                    ))}
                  </div>
                  
                  {expandedCards.has(idx) && (
                    <div className="mt-3.5 pt-3.5 border-t border-border animate-in slide-in-from-top-2 duration-300">
                      <ul className="space-y-1">
                        {item.details.map((detail, didx) => (
                          <li key={didx} className="text-xs text-primary flex items-start gap-1.5">
                            <span className="text-primary">→</span> {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'firstmover':
        return (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold mb-1.5">{data?.sections.firstmover.title}</h2>
            <p className="text-sm text-muted-foreground mb-6">{data?.sections.firstmover.subtitle}</p>
            
            <div className="space-y-5">
              {data?.sections.firstmover.scorecards.map((card, idx) => (
                <div key={idx} className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-4">{card.title}</h3>
                  <div className="space-y-3">
                    {card.scores.map((score, sidx) => (
                      <div key={sidx} className="flex items-center gap-3">
                        <div className="w-44 text-xs text-muted-foreground">{score.label}</div>
                        <div className="flex-1 bg-muted h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ease-out`}
                            style={{ 
                              width: `${score.value}%`,
                              background: score.color === 'green' ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #f59e0b, #fcd34d)'
                            }}
                          />
                        </div>
                        <div className={`w-9 text-right text-xs font-bold ${score.color === 'green' ? 'text-[#34d399]' : 'text-[#fcd34d]'}`}>
                          {score.value / 10}/10
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-card border border-border rounded-xl p-5">
              <h3 className="text-base font-bold mb-3">🏆 Top First Mover Picks (Ranked)</h3>
              <div className="flex flex-col gap-2">
                {data?.sections.firstmover.topPicks.map((pick, pidx) => (
                  <div key={pidx} className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
                    <div className="text-xl">{pick.rank}</div>
                    <div>
                      <div className="font-bold text-sm">{pick.title}</div>
                      <div className="text-[12px] text-muted-foreground">{pick.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'roadmap':
        return (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold mb-1.5">{data?.sections.roadmap.title}</h2>
            <p className="text-sm text-muted-foreground mb-6">{data?.sections.roadmap.subtitle}</p>
            <div className="relative pl-8 border-l border-border ml-2 space-y-6">
              {data?.sections.roadmap.phases.map((phase, idx) => (
                <div key={idx} className="relative">
                  <div className={`absolute -left-[41px] top-1 w-4 h-4 rounded-full border-2 border-background z-10 ${
                    phase.color === 'green' ? 'bg-[#10b981]' :
                    phase.color === 'blue' ? 'bg-[#3b82f6]' :
                    phase.color === 'purple' ? 'bg-[#8b5cf6]' :
                    'bg-[#f59e0b]'
                  }`} />
                  <div className="bg-card border border-border rounded-xl p-4 md:p-5">
                    <div className="text-[10px] text-muted-foreground font-bold uppercase mb-1">{phase.phase}</div>
                    <div className="text-base font-bold mb-1.5">{phase.title}</div>
                    <p className="text-[12px] text-muted-foreground leading-relaxed mb-3">{phase.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {phase.tags.map((tag, tidx) => (
                        <span key={tidx} className="text-[10px] bg-muted text-primary px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'gaps':
        return (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold mb-1.5">{data?.sections.gaps.title}</h2>
            <p className="text-sm text-muted-foreground mb-6">{data?.sections.gaps.subtitle}</p>
            <div className="overflow-x-auto bg-card border border-border rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-primary/10 text-muted-foreground uppercase tracking-wider">
                    {data?.sections.gaps.table.headers.map((header, idx) => (
                      <th key={idx} className="p-3.5 font-bold">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary">
                  {data?.sections.gaps.table.rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-primary/10 transition-colors">
                      <td className="p-3.5 font-bold">{row.area}</td>
                      <td className="p-3.5">{row.who}</td>
                      <td className="p-3.5 text-muted-foreground italic">{row.current}</td>
                      <td className="p-3.5 font-semibold text-foreground">{row.size}</td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${row.statusType === 'red' ? 'bg-[#ef4444]' : 'bg-[#f59e0b]'}`} />
                          {row.status}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="text-[13px] font-bold mb-2 text-foreground flex items-center gap-2">
                  <span className="text-orange-500">⚠️</span> Policy Execution Risks
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{data?.sections.gaps.risks}</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="text-[13px] font-bold mb-2 text-foreground flex items-center gap-2">
                  <span className="text-green-500">✅</span> Why First Movers Win Here
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{data?.sections.gaps.wins}</p>
              </div>
            </div>
          </div>
        );

      case 'checklist':
        return (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold mb-1.5">{data?.sections.checklist.title}</h2>
            <p className="text-sm text-muted-foreground mb-6">{data?.sections.checklist.subtitle}</p>
            
            <div className="bg-card border border-border rounded-xl p-5 mb-5 shadow-inner">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold">Launch Readiness</span>
                <span className="text-sm font-bold text-primary">{checklistProgress}%</span>
              </div>
              <div className="bg-muted h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-linear-to-r from-[#3b82f6] to-[#10b981] transition-all duration-500"
                  style={{ width: `${checklistProgress}%` }}
                />
              </div>
            </div>

            <div className="space-y-6">
              {data?.sections.checklist.categories.map((cat, idx) => (
                <div key={idx}>
                  <h4 className="text-sm font-bold mb-3 text-primary border-b border-border pb-2">{cat.title}</h4>
                  <div className="space-y-0.5">
                    {cat.items.map((item, iidx) => {
                      const id = `${idx}-${iidx}`;
                      const isChecked = checkedItems[id];
                      return (
                        <div
                          key={iidx}
                          onClick={() => toggleCheck(id)}
                          className={`flex items-start gap-3 py-2.5 border-b border-border last:border-0 cursor-pointer group hover:bg-accent/30 px-2 rounded-lg transition-colors`}
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            isChecked ? 'bg-[#10b981] border-[#10b981]' : 'border-[#3b4a70] group-hover:border-primary'
                          }`}>
                            {isChecked && <span className="text-foreground text-[10px]">✓</span>}
                          </div>
                          <p className={`text-sm leading-tight transition-all ${
                            isChecked ? 'line-through text-primary' : 'text-primary'
                          }`}>
                            {item}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="bg-card p-6 md:px-8 flex flex-col md:flex-row items-center gap-4">
        {/* <div className="text-4xl">🎮</div> */}
        <div className="text-center md:text-left">
          <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">{data?.header.title}</h1>
          <p className="text-[12px] md:text-sm text-muted-foreground mt-1">{data?.header.subtitle}</p>
        </div>
        <div className="md:ml-auto">
          <div className="bg-linear-to-r from-[#ff6b35] to-[#f7c59f] text-black text-[10px] font-black px-3 py-1 rounded-full whitespace-nowrap shadow-lg shadow-orange-500/20">
            {data?.header.badge}
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="flex flex-wrap bg-primary/10 border-b border-border">
        {data?.stats.map((stat, idx) => (
          <div key={idx} className="flex-1 min-w-[50%] md:min-w-0 p-4 text-center border-r border-border last:border-0 transition-colors">
            <div className="text-xl md:text-2xl font-black text-primary">{stat.val}</div>
            <div className="text-[10px] text-foreground uppercase font-bold tracking-widest mt-1">{stat.lbl}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row min-h-[calc(100vh-140px)]">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-card border-b md:border-b-0 md:border-r border-border py-4 md:py-6 shrink-0">
          <div className="px-5 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary">Navigation</div>
          <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible no-scrollbar">
            {data?.navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-3 px-5 py-3.5 text-sm font-medium border-b-2 md:border-b-0 md:border-l-4 transition-all whitespace-nowrap ${
                  activeSection === item.id 
                    ? 'bg-accent text-white border-primary font-bold' 
                    : 'text-muted-foreground border-transparent hover:bg-accent hover:text-foreground'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6 md:p-10 overflow-hidden">
          <div className="max-w-6xl mx-auto">
            {renderSection()}
          </div>
        </main>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default AVGCAnalyzer;
