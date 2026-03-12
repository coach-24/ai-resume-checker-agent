function SkillList({skills}) {
  return (
    <ul>
      {skills.map((skill,index)=>(
        <li key={index} className="text-red-500">
          {skill}
        </li>
      ))}
    </ul>
  )
}

export default SkillList