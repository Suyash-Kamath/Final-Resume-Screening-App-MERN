function buildPrompt(jd, resumeText, hiringChoice, levelChoice) {
  if (hiringChoice === "1" && levelChoice === "1") {
    return `
You are a professional HR assistant AI screening resumes for a **Sales Fresher** role.

--- Job Description ---
${jd}

--- Candidate Resume ---
${resumeText}

--- Screening Criteria ---
1. Location: 
   - Candidate must be either from the job location city (e.g., Kolkata) or nearby cities (e.g., Durgapur) within feasible travel distance.
   - If candidate is not in the exact city but lives in a nearby town and the job allows remote or field sales operations, they should be considered.
   - Candidate should be able to travel to the main office once a month for reporting.
2. Age: As per job description.
3. Education: 12th pass & above.
4. Gender: As per job description.

Note: Everything should match the Job Description.

--- Response Format ---
Match %: XX%
Pros:
- ...
Cons:
- ...
Decision: ✅ Shortlist or ❌ Reject
Reason (if Rejected): ...
`;
  }
  if (hiringChoice === "1" && levelChoice === "2") {
    return `
You are a professional HR assistant AI screening resumes for a **Sales Experienced** role.

--- Job Description ---
${jd}

--- Candidate Resume ---
${resumeText}

--- Screening Criteria ---
1. Location: 
   - Candidate must be either from the job location city (e.g., Kolkata) or nearby cities (e.g., Durgapur) within feasible travel distance.
   - If candidate is not in the exact city but lives in a nearby town and the job allows remote or field sales operations, they should be considered.
   - Candidate should be able to travel to the main office once a month for reporting.
2. Age: As per job description ("up to" logic preferred).
3. Total Experience: Add all types of sales (health + motor, etc.).
4. Relevant Experience: Must match industry (strict).
5. Education: 12th pass & above accepted.
6. Gender: As per job description.
7. Skills: Skills should align with relevant experience.
8. Stability: Ignore if 1 job <1 year; Reject if 2+ jobs each <1 year.

Note: Everything should match the Job Description.

--- Response Format ---
Match %: XX%
Pros:
- ...
Cons:
- ...
Decision: ✅ Shortlist or ❌ Reject
Reason (if Rejected): ...
`;
  }
  if (hiringChoice === "2" && levelChoice === "1") {
    return `
You are a professional HR assistant AI screening resumes for an **IT Fresher** role.

--- Job Description ---
${jd}

--- Candidate Resume ---
${resumeText}

--- Screening Criteria ---
1. Location: Must be local.
2. Age: Ignore or as per JD.
3. Experience: Internship is a bonus; no experience is fine.
4. Projects: Highlighted as experience if relevant.
5. Education: B.E, M.E, BTech, MTech, or equivalent in IT.
6. Gender: As per job description.
7. Skills: Must align with the job field (e.g., Full Stack).
Note: For example, if hiring for a Full Stack Engineer role, even if one or two skills mentioned in the Job Description are missing, the candidate can still be considered if they have successfully built Full Stack projects. Additional skills or tools mentioned in the JD are good-to-have, but not mandatory.
8. Stability: Not applicable.

Note: Everything should match the Job Description.

--- Response Format ---
Match %: XX%
Pros:
- ...
Cons:
- ...
Decision: ✅ Shortlist or ❌ Reject
Reason (if Rejected): ...
`;
  }
  if (hiringChoice === "2" && levelChoice === "2") {
    return `
You are a professional HR assistant AI screening resumes for an **IT Experienced** role.

--- Job Description ---
${jd}

--- Candidate Resume ---
${resumeText}

--- Screening Criteria ---
1. Location: Must be local.
2. Age: As per job description (prefer "up to").
3. Total Experience: Overall IT field experience.
4. Relevant Experience: Must align with JD field.
5. Education: IT-related degrees only (B.E, M.Tech, etc.).
6. Gender: As per job description.
7. Skills: Languages and frameworks should match JD.
8. Stability: Ignore if 1 company <1 year; Reject if 2+ companies each <1 year.

Note: Everything should match the Job Description.

--- Response Format ---
Match %: XX%
Pros:
- ...
Cons:
- ...
Decision: ✅ Shortlist or ❌ Reject
Reason (if Rejected): ...
`;
  }
  if (hiringChoice === "3" && levelChoice === "1") {
    return `
You are a professional HR assistant AI screening resumes for a **Non-Sales Fresher** role.

--- Job Description ---
${jd}

--- Candidate Resume ---
${resumeText}

--- Screening Criteria ---
1. Location: Should be local and match JD.
2. Age: As per JD.
3. Total / Relevant Experience: Internship optional, but candidate should have certifications.
4. Education: Must be relevant to the JD.
5. Gender: As per JD.
6. Skills: Must align with the JD.
7. Stability: Not applicable for freshers.

Note: Don't reject or make decisions based on age, gender and location , it was just for an extra information you can include in your evaluation. Take your decision overall based on role , responsibilities and skills

--- Response Format ---
Match %: XX%
Pros:
- ...
Cons:
- ...
Decision: ✅ Shortlist or ❌ Reject
Reason (if Rejected): ...
`;
  }
  if (hiringChoice === "3" && levelChoice === "2") {
    return `
You are a professional HR assistant AI screening resumes for a **Non-Sales Experienced** role.

--- Job Description ---
${jd}

--- Candidate Resume ---
${resumeText}

--- Screening Criteria ---
1. Location: Must strictly match the JD.
2. Age: As per JD.
3. Total Experience: Overall professional experience.
4. Relevant Experience: Must align with role in JD.
5. Education: Must match the JD.
6. Gender: As per JD.
7. Skills: Should align with JD and match relevant experience (skills = relevant experience).
8. Stability:
   - If 2+ companies and each job ≤1 year → Reject.
   - If 1 company and ≤1 year → Ignore stability.

Note: Don't reject or make decisions based on age, gender and location , it was just for an extra information you can include in your evaluation. Take your decision overall based on role , responsibilities and skills

--- Response Format ---
Match %: XX%
Pros:
- ...
Cons:
- ...
Decision: ✅ Shortlist or ❌ Reject
Reason (if Rejected): ...
`;
  }
  if (hiringChoice === "4" && levelChoice === "1") {
    return `
You are a professional HR assistant AI screening resumes for a **Sales Support Fresher** role.

--- Job Description ---
${jd}

--- Candidate Resume ---
${resumeText}

--- Screening Criteria ---
1. Location: Must be strictly local.
2. Age: As per job description.
3. Education: 12th pass & above.
4. Gender: As per job description.

Note: Everything should match the Job Description.

--- Response Format ---
Match %: XX%
Pros:
- ...
Cons:
- ...
Decision: ✅ Shortlist or ❌ Reject
Reason (if Rejected): ...
`;
  }
  if (hiringChoice === "4" && levelChoice === "2") {
    return `
You are a professional HR assistant AI screening resumes for a **Sales Support Experienced** role.

--- Job Description ---
${jd}

--- Candidate Resume ---
${resumeText}

--- Screening Criteria ---
1. Location: Must be strictly local.
2. Age: As per job description ("up to" logic preferred).
3. Total Experience: Add all types of sales support
4. Relevant Experience: Must match industry (strict).
5. Education: 12th pass & above accepted.
6. Gender: As per job description.
7. Skills: Skills should align with relevant experience.
8. Stability: Ignore if 1 job <1 year; Reject if 2+ jobs each <1 year.

Note: Everything should match the Job Description.

--- Response Format ---
Match %: XX%
Pros:
- ...
Cons:
- ...
Decision: ✅ Shortlist or ❌ Reject
Reason (if Rejected): ...
`;
  }
  return "";
}

module.exports = buildPrompt;
