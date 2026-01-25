# Judgement Dip

> Source: [Judgement_Dip](https://xkcd-time.fandom.com/wiki/Judgement_Dip)

The **Judgement Dip** is a mechanic in [[Sandcastle_Builder|Sandcastle Builder]] that is caused by large amounts of [[Castle_Tools|NewPixBots]] building large amounts of castles. The more castles built (and NewPixBots owned), the higher the Judgement Dip level goes, which causes a set number of castles to be destroyed every 25 mNP. However, a large Judgement Dip level is required to unlock a multitude of [[Boosts|boosts]], including some that can mitigate and disable Judgement Dip entirely.

## Effects

The base formula for the current Judgement Dip level is:

NewPixBots owned * castles built by NewPixBots * boost count / 500,000,000

where Boost count is the number of Cybernetic, Chronotech, and Hill People Tech boosts owned; this count is multiplied by 1.35 for every owned boost above 25, and 1.8225 for every owned boost above 40. [1]

However, there are some modifiers to the level:

- [[boosts/Bag Burning|Bag Burning]] divides the Boost count by 1.4 or 1.4(Bags owned - 14) / 2, whichever is higher.
This divider caps at 1e294 (Tera Wololo Wololo Quita), and will auto-lock if this cap is reached while owning [[boosts/Bacon|Bacon]].
- [[boosts/Coma Molpy Style|Coma Molpy Style]] halfs the Judgement Dip level.
- The level has a limit of 2current NewPix / 2 - 20 or 2(200 - current NewPix)2 / 250 + current NewPix / 2 - 20, whichever is higher. If the level formula given above gives a higher number than this limit, the level is set to the limit instead.
Note that decreasing the NewPix cannot disable the Judgement Dip entirely.
- [[boosts/Summon Knights Temporal|Summon Knights Temporal]], when activated, halves the amount of castles built by NewPixBots for the purposes of calculating Judgement Dip.
- NewPixBots Navigation Code, when active, sets the level to 0 (ie, disables Judgement Dip).
- Note that the level displayed in the log is one level lower than the one calculated by the formula.
- Also note that, since [[boosts/Affordable Swedish Home Furniture|Affordable Swedish Home Furniture]] is a Hill People Tech boost, receiving it can increase the level for the period it is active.

The amount of castles destroyed per NewPixBot per mNP, given the level, is formulated as:

(level - 1)1 + (1 or level/1e7, whichever is lower) - (1 or level/1e150, whichever is lower) * (1 or (1e12 or level/1e150, whichever is lower), whichever is higher) or 0, whichever is higher.

Note to get the amount reported in the log, this must be multiplied by NewPixBots owned * 25.

The countdown shown in the Judgement Dip Warning badge is the amount of NewPix until the Judgement Dip increases in level, assuming no NewPixBots will be built, and they will not be ninja'd. The countdown also takes into account the NewPix level limit.

[1] More accurately, the game runs checks each boost eligible to increase the count. For each one it finds, the count is increased by one, and multiplies it at that point (rather than at the end). As such, the last boost count increase is negligible compared to the multiplier it applies to the count.

## Rewards

Note that the level needed is one higher than that displayed in the log, and that boosts can still be received from DoRD if you are currently not above that level (ie, you can receive them as long as you've been at that level at one point).

| Level needed | Boost unlocked | Other requirements |
| --- | --- | --- |
| 1 | Judgement Dip Warning (badge) |  |
| 2 | Judgement Dip (badge) |  |
| 3 | [[boosts/Summon Knights Temporal|Summon Knights Temporal]] | [[boosts/Time Travel|Time Travel]], WITHOUT [[boosts/Doublepost|Doublepost]] or [[boosts/Overcompensating|Overcompensating]] |
| 4 | [[boosts/Bag Burning|Bag Burning]] | 12 bags, WITHOUT [[boosts/Fireproof|Fireproof]] |
| 5 | [[boosts/Ninja Assistants|Ninja Assistants]] | via DoRD |
| 6 | [[boosts/Minigun|Minigun]] | via DoRD |
| 7 | [[boosts/Stacked|Stacked]] | via DoRD |
| 8 | [[boosts/Big Splash|Big Splash]] | via DoRD w/ [[boosts/Minigun|Minigun]] or [[boosts/Stacked|Stacked]] |
| 9 | [[boosts/Irregular Rivers|Irregular Rivers]] | via DoRD /w [[boosts/Stacked|Stacked]] or [[boosts/Big Splash|Big Splash]] |
| 13 | On the 12th Dip of Judgement (badge) |  |
| 13 | [[boosts/NewPixBot Navigation Code|NewPixBot Navigation Code]] | via DoRD w/ [[boosts/Big Splash|Big Splash]] or [[boosts/Irregular Rivers|Irregular Rivers]] |
| 31 |  | [[boosts/NewPixBot Navigation Code|NewPixBot Navigation Code]] discounted to 33 Kilo sand, 7400 castles if you have [[boosts/Flux Turbine|Flux Turbine]] |
| N/A | [[boosts/Bacon|Bacon]] | Infinite castles destroyed in 25 mNP w/ 100 [[boosts/Logicat|Logicat]] levels and [[boosts/Frenchbot|Frenchbot]], automatically spends 100 [[boosts/Logicat|Logicat]] levels to unlock (It's in the Codex!) |