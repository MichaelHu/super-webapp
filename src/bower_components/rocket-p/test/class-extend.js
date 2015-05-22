(function(){

var classExtend = null;

module('classExtend', {
    setup: function(){
        classExtend = Rocket.extend;
    }
});

test('extend', function(){
    
    function Person(name, sex, age){
        this.name = name;
        this.sex = sex;
        this.age = age;
    } 

    Person.prototype.sayHello = function(){
        var p = ('Hello, my name is ' + this.name + '. I am ' + this.age + ' years old.');
        return p;
    };

    Person.extend = classExtend;

    var Student = Person.extend(
            {
                constructor: function(name, sex, age, grade){
                    Student._superClass.apply(this, arguments);
                    this.grade = grade;
                } 

                , sayHello: function(){
                    var p = this._super();
                    p += (' I am in grade ' + this.grade + '.');
                    return p;
                }
            }
        );

    var Master = Student.extend(
            {
                constructor: function(name, sex, age, grade, major){
                    Master._superClass.apply(this, arguments);
                    this.major = major;
                } 

                , sayHello: function(){
                    var p = this._super();
                    p += (' I major in ' + this.major + '.');
                    return p;
                }
            }
        ); 

    var person = new Person('Bush', 'male', 32);
    var student = new Student('Messi', 'male',  33, 3);
    var master = new Master('Obama', 'male', 45, 2, 'history');

    ok(person instanceof Object, 'person is an instance of Object');
    ok(person instanceof Person, 'person is an instance of Person');
    ok(student instanceof Person, 'student is an instance of Person');
    ok(student instanceof Student, 'student is an instance of Student');
    ok(master instanceof Student, 'master is an instance of Student');
    ok(master instanceof Master, 'master is an instance of Master');

    equal(
        master.sayHello()
        , 'Hello, my name is Obama. I am 45 years old. I am in grade 2. I major in history.'
        , 'master.sayHello test passes'
    );

});




})();
