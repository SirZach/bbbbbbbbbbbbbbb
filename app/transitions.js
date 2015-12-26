export default function() {
  this.transition(
    this.fromRoute('user.index'),
    this.toRoute('user.change-password'),
    this.use('toDown'),
    this.reverse('toUp')
  );
}
